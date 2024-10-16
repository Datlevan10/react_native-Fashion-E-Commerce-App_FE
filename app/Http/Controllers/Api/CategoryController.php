<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\CategoryResource;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // method GET
    public function index() {
        $categories = Category::get();
        if ($categories->count() > 0) {
            return CategoryResource::collection($categories);
        }
        else {
            return response()->json(['message' => 'No Record Available'], 200);
        }
    }

    // method POST
    public function store(Request $request) {

        $validator = Validator::make($request->all(), [
            'category_name' => 'required|string|max:255',
            'image_category' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'required|string',
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

        // Handle image with Storage
        if ($request->hasFile('image_category')) {
            $image = $request->file('image_category');
            $imageName = time().'.'.$image->getClientOriginalExtension();
            $imagePath = $image->storeAs('categories', $imageName, 'public');
            $imageUrl = Storage::url($imagePath);
        }

        $categories = Category::create([
            'category_name' => $request->category_name,
            'image_category' => $imageUrl ?? null,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Category created success',
            'data' => new CategoryResource($categories)
        ], 200);
    }

    // method GET Detail
    public function show(Category $category) {
        return new CategoryResource($category);
    }

    // method PUT
    public function update(Request $request, Category $category) {
        $validator = Validator::make($request->all(), [
            'category_name' => 'sometimes|string|max:255',
            'image_category' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'sometimes|string|max:255',
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

        // Handle image with Storage
        if ($request->hasFile('image_category')) {
            $image = $request->file('image_category');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('categories', $imageName, 'public');
            $imageUrl = Storage::url($imagePath);

            if ($category->image_category) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $category->image_category));
            }
        }

        $category->update([
            'category_name' => $request->category_name ?? $category->category_name,
            'image_category' => $imageUrl ?? $category->image_category,
            'description' => $request->description ?? $category->description,
        ]);

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => new CategoryResource($category)
        ], 200);
    }


    // method DELETE
    public function destroy(Category $category) {
        if ($category->image_category) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $category->image_category));
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted success',
        ], 200);
    }
}
