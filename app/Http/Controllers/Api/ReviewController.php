<?php

namespace App\Http\Controllers\Api;

use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    // method GET
    public function index() {
        $reviews = Review::get();
        if ($reviews->count() > 0) {
            return response()->json([
                'message' => 'Get reviews success',
                'data' => ReviewResource::collection($reviews)
            ], 200);
        }
        else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    // method POST
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'nullable|string',
            'product_id' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => ['required', 'string', 'email', 'regex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i'],
            'stars_review' => 'required|integer|min:1|max:5',
            'review_title' => 'required|string',
            'review_product' => 'required|string',
            'media' => 'nullable|array',
            'media.*' => 'file|mimes:jpeg,png,jpg,gif,svg,mp4,avi|max:20480',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', [
                'errors' => $validator->messages(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Field is empty or invalid',
                'error' => $validator->messages(),
            ], 422);
        }

        $mediaPaths = [];
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $mediaFile) {
                $mediaName = time() . '_' . $mediaFile->getClientOriginalName();
                $mediaPath = $mediaFile->storeAs('reviews', $mediaName, 'public');
                $mediaPaths[] = Storage::url($mediaPath);
            }
        }

        $customer_type = $request->filled('customer_id') ? 'registered' : 'guest';
        $status = in_array($request->stars_review, [4, 5]) ? 'approved' : 'pending';

        $review = Review::create([
            'customer_id' => $request->customer_id,
            'product_id' => $request->product_id,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_type' => $customer_type,
            'stars_review' => $request->stars_review,
            'review_title' => $request->review_title,
            'review_product' => $request->review_product,
            'media' => $mediaPaths,
            'status' => $status,
            'review_date' => now(),
        ]);

        $product = Product::find($request->product_id);

        if ($product) {
            $total_review = $product->total_review + 1;
            $average_review = ($product->average_review * $product->total_review + $request->stars_review) / $total_review;

            $product->total_review = $total_review;
            $product->average_review = $average_review;
            $product->save();
        }

        return response()->json([
            'message' => 'Review created successfully',
            'data' => new ReviewResource($review)
        ], 201);
    }

    // GET review by product_id
    public function getReviewsByProductId($product_id) {
        $reviews = Review::where('product_id', $product_id)->get();

        if ($reviews->count() > 0) {
            return response()->json([
                'message' => 'Get reviews by product_id success',
                'data' => ReviewResource::collection($reviews)
            ], 200);
        } else {
            return response()->json(['message' => 'No reviews found for this product'], 200);
        }
    }

    // GET review by status pending
    public function getPendingReviews() {
        $reviews = Review::where('status', 'pending')->get();

        if ($reviews->count() > 0) {
            return response()->json([
                'message' => 'Get pending reviews success',
                'data' => ReviewResource::collection($reviews)
            ], 200);
        } else {
            return response()->json(['message' => 'No pending reviews found'], 200);
        }
    }

    // GET review by status approved
    public function getApprovedReviews() {
        $reviews = Review::where('status', 'approved')->get();

        if ($reviews->count() > 0) {
            return response()->json([
                'message' => 'Get approved reviews success',
                'data' => ReviewResource::collection($reviews)
            ], 200);
        } else {
            return response()->json(['message' => 'No approved reviews found'], 200);
        }
    }

    // GET review by status unpublished
    public function getUnpublishedReviews() {
        $reviews = Review::where('status', 'unpublished')->get();

        if ($reviews->count() > 0) {
            return response()->json([
                'message' => 'Get unpublished reviews success',
                'data' => ReviewResource::collection($reviews)
            ], 200);
        } else {
            return response()->json(['message' => 'No unpublished reviews found'], 200);
        }
    }

    // method GET Detail review review_id
    public function show($review_id) {
        try {
            $review = Review::where('review_id', $review_id)->first();
            if (!$review) {
                return response()->json([
                    'message' => 'Review not found',
                    'review_id' => $review_id
                ], 404);
            }

            return response()->json([
                'message' => 'Get review success with review_id',
                'data' => new ReviewResource($review)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get review information', [
                'error' => $e->getMessage(),
                'review_id' => $review_id
            ]);

            return response()->json([
                'message' => 'Failed to get review information',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // method PUT Publish review
    public function publishReview($review_id) {
        $review = Review::find($review_id);

        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        if (!in_array($review->status, ['unpublished', 'pending'])) {
            return response()->json(['message' => 'Review is not unpublished or pending, cannot be published'], 400);
        }

        $review->status = 'approved';
        $review->save();

        return response()->json([
            'message' => 'Review published successfully',
            'data' => new ReviewResource($review)
        ], 200);
    }


    // method PUT Unpublish review
    public function unpublishReview($review_id) {
        $review = Review::find($review_id);

        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        if ($review->status !== 'approved') {
            return response()->json(['message' => 'Review is not approved, cannot be unpublished'], 400);
        }

        $review->status = 'unpublished';
        $review->save();

        return response()->json([
            'message' => 'Review unpublished successfully',
            'data' => new ReviewResource($review)
        ], 200);
    }

    // method DELETE
    public function destroy(Review $review)
    {
        if ($review->image) {
            $imagePaths = json_decode($review->image);
            foreach ($imagePaths as $imagePath) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $imagePath));
            }
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully',
        ], 200);
    }
}
