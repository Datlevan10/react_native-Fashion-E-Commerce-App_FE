<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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
            'categoryName' => 'required|string|max:255',
            'description' => 'required|string',
            // 'description' => 'required|string|max:255',
        ]);

        if($validator->fails()){
            return response()->json([
                'message' => 'Field is empty',
                'error' => $validator->messages(),
            ], 422);
        }

        $categories = Category::create([
            'categoryName' => $request->categoryName,
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
            'categoryName' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        if($validator->fails()){
            return response()->json([
                'message' => 'Field is empty',
                'error' => $validator->messages(),
            ], 422);
        }

        $category->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Category updated success',
            'data' => new CategoryResource($category)
        ], 200);
    }

    // method DELETE
    public function destroy(Category $category) {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted success',
        ], 200);
    }
}
