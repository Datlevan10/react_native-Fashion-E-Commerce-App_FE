<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    // method GET
    public function index() {
        $products = Product::get();
        if ($products->count() > 0) {
            return response()->json([
                // 'message' => 'Get product success',
                'data' => ProductResource::collection($products)
            ], 200);
        }
        else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    // method POST
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'categoryId' => 'required|exists:categories,categoryId',
            'productName' => 'required|string|max:255',
            'description' => 'required|string',
            'color' => 'required|array|min:1',
            'color.*' => 'string|max:50',
            'size' => 'required|array|min:1',
            'size.*' => 'string|max:10',
            'image' => 'required|array|min:1',
            'image.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'oldPrice' => 'required|numeric|min:0',
            'newPrice' => 'nullable|numeric|min:0',
        ]);

        if($validator->fails()){
            Log::error('Validation failed', [
                'errors' => $validator->messages(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Field is empty or invalid',
                'error' => $validator->messages(),
            ], 422);
        }

        $imagePaths = [];
        if ($request->hasFile('image')) {
            foreach ($request->file('image') as $image) {
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('products', $imageName, 'public');
                $imagePaths[] = Storage::url($imagePath);
            }
        }

        $product = Product::create([
            'categoryId' => $request->categoryId,
            'productName' => $request->productName,
            'description' => $request->description,
            'color' => $request->color,
            'size' => $request->size,
            'image' => $imagePaths,
            'oldPrice' => $request->oldPrice,
            'newPrice' => $request->newPrice ?? $request->oldPrice,
            'totalReview' => 0,
            'averageReview' => 0,
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => new ProductResource($product)
        ], 200);
    }

    // method GET Detail
    public function show(Product $product) {
        return new ProductResource($product);
    }

    // method PUT
    public function update(Request $request, Product $product) {
        $validator = Validator::make($request->all(), [
            'categoryId' => 'sometimes|exists:categories,categoryId',
            'productName' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'color' => 'sometimes|array|min:1',
            'color.*' => 'string|max:50',
            'size' => 'sometimes|array|min:1',
            'size.*' => 'string|max:10',
            'image' => 'nullable|array|min:1',
            'image.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'oldPrice' => 'sometimes|numeric|min:0',
            'newPrice' => 'nullable|numeric|min:0',
        ]);

        if($validator->fails()){
            Log::error('Validation failed', [
                'errors' => $validator->messages(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Field is empty or invalid',
                'error' => $validator->messages(),
            ], 422);
        }

        $imagePaths = $product->image;
        if ($request->hasFile('image')) {
            $imagePaths = [];
            foreach ($request->file('image') as $image) {
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('products', $imageName, 'public');
                $imagePaths[] = Storage::url($imagePath);
            }
        }

        $product->update([
            'categoryId' => $request->categoryId ?? $product->categoryId,
            'productName' => $request->productName ?? $product->productName,
            'description' => $request->description ?? $product->description,
            'color' => $request->color ?? $product->color,
            'size' => $request->size ?? $product->size,
            'image' => !empty($imagePaths) ? $imagePaths : $product->image,
            'oldPrice' => $request->oldPrice ?? $product->oldPrice,
            'newPrice' => $request->newPrice ?? $product->newPrice,
        ]);

        return response()->json([
            'message' => 'Product updated success',
            'data' => new ProductResource($product)
        ], 200);
    }

    // method DELETE
    public function destroy(Product $product) {
        if ($product->image) {
            $imagePaths = json_decode($product->image);
            foreach ($imagePaths as $imagePath) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $imagePath));
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ], 200);
    }

}
