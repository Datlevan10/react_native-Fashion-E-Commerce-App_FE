<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Category;
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

    // method GET Product by category_id
    public function getProductsByCategoryId($category_id) {
        $categoryExists = Category::where('category_id', $category_id)->exists();

        if (!$categoryExists) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $products = Product::where('category_id', $category_id)->get();

        if ($products->count() > 0) {
            return response()->json([
                'message' => 'Get product by category_id successfully',
                'data' => ProductResource::collection($products)
            ], 200);
        } else {
            return response()->json(['message' => 'No products found in this category'], 200);
        }
    }

    // method GET Product by category_id with limited quantity by $limit parameter
    public function getLimitedProductsByCategoryId($category_id, $limit)
    {
        $categoryExists = Category::where('category_id', $category_id)->exists();

        if (!$categoryExists) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $products = Product::where('category_id', $category_id)->limit($limit)->get();

        if ($products->count() > 0) {
            return response()->json([
                'message' => "Get {$limit} products by category_id successfully",
                'data' => ProductResource::collection($products)
            ], 200);
        } else {
            return response()->json(['message' => 'No products found in this category'], 200);
        }
    }

    // method GET products with limited quantity by $limit parameter
    public function getLimitedProducts($limit)
    {
        $products = Product::limit($limit)->get();

        return response()->json([
            'message' => "Get {$limit} limited products successfully",
            'data' => ProductResource::collection($products)
        ], 200);
    }

    // method POST
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,category_id',
            'product_name' => 'required|string|max:255',
            'description' => 'required|string',
            'color' => 'required|array|min:1',
            'color.*' => 'string|max:50',
            'size' => 'required|array|min:1',
            'size.*' => 'string|max:10',
            'image' => 'required|array|min:1',
            'image.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'old_price' => 'nullable|numeric|min:0',
            'new_price' => 'required|numeric|min:0',
            'note' => 'nullable|string|max:255',
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
            'category_id' => $request->category_id,
            'product_name' => $request->product_name,
            'description' => $request->description,
            'color' => array_map(fn($color) => ['color_code' => $color], $request->color),
            'size' => array_map(fn($size) => ['size' => $size], $request->size),
            // Unprocessed when uploaded image exceeds the 2MB size limit
            'image' => array_map(fn($url) => ['url' => $url], $imagePaths),
            'old_price' => $request->old_price,
            'new_price' => $request->new_price ?? $request->old_price,
            'note' => $request->note,
            'total_review' => 0,
            'average_review' => 0,
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => new ProductResource($product)
        ], 201);
    }

    // method GET Detail with product_id
    public function show($product_id) {
        try {
            $product = Product::where('product_id', $product_id)->first();
            if (!$product) {
                return response()->json([
                    'message' => 'Product not found',
                    'product_id' => $product_id
                ], 404);
            }

            return response()->json([
                'message' => 'Get product success with product_id',
                'data' => new ProductResource($product)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get product information', [
                'error' => $e->getMessage(),
                'product_id' => $product_id
            ]);

            return response()->json([
                'message' => 'Failed to get product information',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // method PUT
    public function update(Request $request, Product $product) {
        $validator = Validator::make($request->all(), [
            'category_id' => 'sometimes|exists:categories,category_id',
            'product_name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'color' => 'sometimes|array|min:1',
            'color.*' => 'string|max:50',
            'size' => 'sometimes|array|min:1',
            'size.*' => 'string|max:10',
            'image' => 'sometimes|array|min:1',
            'image.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'old_price' => 'sometimes|numeric|min:0',
            'new_price' => 'sometimes|numeric|min:0',
            'note' => 'nullable|string|max:255',
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
            'category_id' => $request->category_id ?? $product->category_id,
            'product_name' => $request->product_name ?? $product->product_name,
            'description' => $request->description ?? $product->description,
            'color' => $request->color ?? $product->color,
            'size' => $request->size ?? $product->size,
            'image' => !empty($imagePaths) ? $imagePaths : $product->image,
            'old_price' => $request->old_price ?? $product->old_price,
            'new_price' => $request->new_price ?? $product->new_price,
            'note' => $request->note ?? $product->note,
        ]);

        return response()->json([
            'message' => 'Product updated success',
            'data' => new ProductResource($product)
        ], 200);
    }

    // // method DELETE
    // public function destroy(Product $product) {
    //     if ($product->image) {
    //         $imagePaths = is_string($product->image) ? json_decode($product->image) : $product->image;

    //         if (is_array($imagePaths)) {
    //             foreach ($imagePaths as $imagePath) {
    //                 Storage::disk('public')->delete(str_replace('/storage/', '', $imagePath));
    //             }
    //         }
    //     }

    //     $product->delete();

    //     return response()->json([
    //         'message' => 'Product deleted successfully',
    //     ], 200);
    // }

    // method DELETE
    public function destroy(Product $product) {
        if ($product->image) {
            $imagePaths = is_string($product->image) ? json_decode($product->image, true) : $product->image;

            if (is_array($imagePaths)) {
                foreach ($imagePaths as $imagePath) {
                    $path = is_array($imagePath) && isset($imagePath['url']) ? $imagePath['url'] : $imagePath;
                    Storage::disk('public')->delete(str_replace('/storage/', '', $path));
                }
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ], 200);
    }

    // method search Product
    public function searchProducts(Request $request)
    {
        $keyword = $request->input('keyword');

        if (!$keyword) {
            return response()->json([
                'message' => 'Please enter search keyword.',
                'data' => []
            ], 400);
        }

        $products = Product::query()
            ->leftJoin('categories', 'products.category_id', '=', 'categories.category_id')
            ->where('products.product_name', 'ILIKE', '%' . $keyword . '%')
            ->orWhere('products.description', 'ILIKE', '%' . $keyword . '%')
            ->orWhere('categories.category_name', 'ILIKE', '%' . $keyword . '%')
            ->orWhere('products.old_price', 'ILIKE', '%' . $keyword . '%')
            ->orWhere('products.new_price', 'ILIKE', '%' . $keyword . '%')
            ->select('products.*')
            ->get();

        $count = $products->count();

        if ($count > 0) {
            return response()->json([
                'message' => "Found $count products matching keyword \"$keyword\".",
                'data' => ProductResource::collection($products)
            ], 200);
        } else {
            return response()->json([
                'message' => "No products were found matching the keyword \"$keyword\".",
                'data' => []
            ], 200);
        }
    }


}
