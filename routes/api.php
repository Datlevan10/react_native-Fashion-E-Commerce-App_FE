<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CartDetailController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomerController;


// Route
Route::apiResource('categories', CategoryController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('admins', AdminController::class);
Route::apiResource('customers', CustomerController::class);
Route::apiResource('carts', CartController::class);
Route::apiResource('cart_details', CartDetailController::class);

Route::get('products/category/{category_id}', [ProductController::class, 'getByCategory']);
Route::get('carts/{cart_id}', [CartController::class, 'getCartById']);
Route::get('carts/customer/{customer_id}', [CartController::class, 'getCartByCustomerId']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
