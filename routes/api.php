<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CartDetailController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\StaffController;

// Route
Route::apiResource('categories', CategoryController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('admins', AdminController::class);
Route::apiResource('staffs', StaffController::class);
Route::apiResource('customers', CustomerController::class);
Route::apiResource('carts', CartController::class);
Route::apiResource('cart_details', CartDetailController::class);

Route::get('products/category/{category_id}', [ProductController::class, 'getProductByCategoryId']);
Route::get('carts/{cart_id}', [CartController::class, 'getCartByCartId']);
Route::get('carts/customer/{customer_id}', [CartController::class, 'getCartByCustomerId']);
Route::get('cart_details/cart/{cart_id}', [CartDetailController::class, 'getCartDetailByCartId']);
Route::get('cart_details/customer/{customer_id}', [CartDetailController::class, 'getCartDetailByCustomerId']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
