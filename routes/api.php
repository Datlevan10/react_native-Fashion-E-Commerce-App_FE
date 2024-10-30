<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AdminController, CartController, CartDetailController,
    ProductController, CategoryController, CustomerController,
    OrderController,
    OrderDetailController,
    ProductFavoriteController,
    ReviewController,
    StaffController,
    StoreController,
    StoreSettingController
};

Route::prefix('')->group(function () {
    // Store Routes Store and Store Settings
    Route::apiResource('stores', StoreController::class);
    Route::apiResource('store_settings', StoreSettingController::class);

    // Category and Product Routes
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);
    Route::get('products/category/{category_id}', [ProductController::class, 'getProductByCategoryId']);

    // User Management Routes (Admin, Staff, Customer)
    Route::apiResource('admins', AdminController::class);
    Route::apiResource('staffs', StaffController::class);
    Route::apiResource('customers', CustomerController::class);

    // Product favorite Routes
    Route::apiResource('product_favorites', ProductFavoriteController::class);
    Route::get('product_favorites/customer/{customer_id}', [ProductFavoriteController::class, 'getFavoriteProductByCustomerId']);

    // Cart and CartDetail Routes
    Route::apiResource('carts', CartController::class);
    Route::get('carts/{cart_id}', [CartController::class, 'getCartByCartId']);
    Route::get('carts/all_carts/customer/{customer_id}', [CartController::class, 'getAllCartByCustomerId']);
    Route::get('carts/not_ordered_carts/customer/{customer_id}', [CartController::class, 'getNotOrderedCartByCustomerId']);

    Route::resource('cart_details', CartDetailController::class)->except(['destroy']);
    Route::get('cart_details/cart/{cart_id}', [CartDetailController::class, 'getCartDetailByCartId']);
    Route::get('cart_details/all_cart_details/customer/{customer_id}', [CartDetailController::class, 'getAllCartDetailByCustomerId']);
    Route::get('cart_details/not_ordered_cart_details/customer/{customer_id}', [CartDetailController::class, 'getNotOrderedCartDetailByCustomerId']);
    Route::delete('cart_details/{cart_detail_id}', [CartDetailController::class, 'deleteItem']);

    // Order and Order Detail Routes
    Route::apiResource('orders', OrderController::class);

    Route::apiResource('order_details', OrderDetailController::class);

    // Review Routes
    Route::apiResource('reviews', ReviewController::class);
    Route::get('/reviews/product/{product_id}', [ReviewController::class, 'getReviewsByProductId']);
    Route::get('/reviews/status/pending', [ReviewController::class, 'getPendingReviews']);
    Route::get('/reviews/status/approved', [ReviewController::class, 'getApprovedReviews']);
    Route::get('/reviews/status/unpublished', [ReviewController::class, 'getUnpublishedReviews']);
    Route::put('/reviews/publish/{review_id}', [ReviewController::class, 'publishReview']);
    Route::put('/reviews/unpublish/{review_id}', [ReviewController::class, 'unpublishReview']);

    // Authenticated User Route
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');
});
