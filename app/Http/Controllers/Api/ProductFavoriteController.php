<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\ProductFavorite;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\ProductFavoriteResource;

class ProductFavoriteController extends Controller
{
    // method GET
    public function index() {
        $product_favorites = ProductFavorite::get();
        if ($product_favorites->count() > 0) {
            return response()->json([
                // 'message' => 'Get cart success',
                'data' => ProductFavoriteResource::collection($product_favorites)
            ], 200);
        }
        else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    // method POST
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|string|exists:customers,customer_id',
            'product_id' => 'required|string|exists:products,product_id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $existingFavorite = ProductFavorite::where('customer_id', $request->customer_id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingFavorite) {
            return response()->json([
                'message' => 'Product is already in wishlist'
            ], 409);
        }

        $product_favorite = ProductFavorite::create([
            'customer_id' => $request->customer_id,
            'product_id' => $request->product_id,
        ]);

        $product_favorite->load('product');

        return response()->json([
            'message' => 'Product added to wishlist successfully',
            'data' => new ProductFavoriteResource($product_favorite)
        ], 201);
    }

    // method DELETE
    public function destroy($product_favorite_id) {
        $product_favorite = ProductFavorite::find($product_favorite_id);

        if (!$product_favorite) {
            return response()->json(['message' => 'Product favorite not found'], 404);
        }

        $product_favorite->delete();

        return response()->json(['message' => 'Product favorite deleted successfully'], 200);
    }
}
