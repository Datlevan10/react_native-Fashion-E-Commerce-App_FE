<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AdminController, CartController, CartDetailController,
    ProductController, CategoryController, CustomerController,
    EventController,
    NotificationController,
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

    // Event Routes
    Route::apiResource('events', EventController::class);
    Route::get('events/is-active/active', [EventController::class, 'getActiveEvents']);
    Route::get('events/is-active/inactive', [EventController::class, 'getInactiveEvents']);
    Route::put('events/{event_id}/set-active', [EventController::class, 'activateEvent']);
    Route::put('events/{event_id}/set-inactive', [EventController::class, 'deactivateEvent']);


    // Category and Product Routes
    Route::apiResource('categories', CategoryController::class);
    Route::get('/categories/{limit}/limit', [CategoryController::class, 'getLimitedCategories']);
    Route::get('products/search', [ProductController::class, 'searchProducts']);
    Route::apiResource('products', ProductController::class);
    Route::get('products/category/{category_id}', [ProductController::class, 'getProductsByCategoryId']);
    Route::get('products/category/{category_id}/{limit}/limit', [ProductController::class, 'getLimitedProductsByCategoryId']);
    Route::get('/products/{limit}/limit', [ProductController::class, 'getLimitedProducts']);
    Route::get('/products/search', [ProductController::class, 'searchProducts']);

    // User Management Routes (Admin, Staff, Customer)
    Route::apiResource('admins', AdminController::class);
    Route::apiResource('staffs', StaffController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::middleware('api')->post('customers/auth/login', [CustomerController::class, 'authenticateLoginCustomer']);
    Route::middleware('auth:sanctum')->post('customers/auth/logout', [CustomerController::class, 'logout']);
    Route::post('customers/auth/refresh-token', [CustomerController::class, 'refreshAccessToken']);
    // Route::middleware('auth:sanctum')->post('customers/auth/refresh-token', [CustomerController::class, 'refreshAccessToken']);
    Route::middleware('auth:sanctum')->get('/profile', function (Request $request) {
        return response()->json($request->user());
    });

    // Product favorite Routes
    Route::apiResource('product_favorites', ProductFavoriteController::class);
    Route::get('product_favorites/customer/{customer_id}', [ProductFavoriteController::class, 'getFavoriteProductByCustomerId']);

    // Cart and CartDetail Routes
    Route::apiResource('carts', CartController::class);
    Route::get('carts/{cart_id}', [CartController::class, 'getCartByCartId']);
    Route::get('carts/all-carts/customer/{customer_id}', [CartController::class, 'getAllCartByCustomerId']);
    Route::get('carts/not-ordered-carts/customer/{customer_id}', [CartController::class, 'getNotOrderedCartByCustomerId']);

    Route::resource('cart_details', CartDetailController::class)->except(['destroy']);
    Route::get('cart_details/cart/{cart_id}', [CartDetailController::class, 'getCartDetailByCartId']);
    Route::get('cart_details/customer/{customer_id}/all-cart-details', [CartDetailController::class, 'getAllCartDetailByCustomerId']);
    Route::get('cart_details/customer/{customer_id}/not-ordered-cart_details', [CartDetailController::class, 'getNotOrderedCartDetailByCustomerId']);
    Route::delete('cart_details/{cart_detail_id}/delete-item-in-cart', [CartDetailController::class, 'deleteItemInCart']);

    // Order and Order Detail Routes
    Route::apiResource('orders', OrderController::class);

    Route::apiResource('order_details', OrderDetailController::class);

    // Notification Routes
    Route::apiResource('notifications', NotificationController::class);
    Route::post('/notifications/hide/{notification_id}', [NotificationController::class, 'hideNotification']);
    // Review Routes
    Route::apiResource('reviews', ReviewController::class);
    Route::get('/reviews/product/{product_id}', [ReviewController::class, 'getReviewsByProductId']);
    Route::get('/reviews/status/pending', [ReviewController::class, 'getPendingReviews']);
    Route::get('/reviews/status/approved', [ReviewController::class, 'getApprovedReviews']);
    Route::get('/reviews/status/unpublished', [ReviewController::class, 'getUnpublishedReviews']);
    Route::put('/reviews/{review_id}/publish', [ReviewController::class, 'publishReview']);
    Route::put('/reviews/{review_id}/unpublish', [ReviewController::class, 'unpublishReview']);

    // Authenticated User Route
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');
});
