<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AdminController, CartController, CartDetailController,
    ProductController, CategoryController, CustomerController,
    EventController, OrderController, OrderDetailController,
    ProductFavoriteController, ReviewController, StaffController,
    StoreController, StoreSettingController
};

// Route Group with Prefixes
Route::prefix('')->group(function () {

    // Store Routes
    Route::prefix('stores')->group(function () {
        Route::apiResource('/', StoreController::class);
    });

    // Store Setting Routes
    Route::prefix('store_settings')->group(function () {
        Route::apiResource('/', StoreSettingController::class);
    });

    // Event Routes
    Route::prefix('events')->group(function () {
        Route::apiResource('/', EventController::class);
        Route::get('/is_active/active', [EventController::class, 'getActiveEvents']);
        Route::get('/is_active/inactive', [EventController::class, 'getInactiveEvents']);
        Route::put('/set-active/{event_id}', [EventController::class, 'activateEvent']);
        Route::put('/set-inactive/{event_id}', [EventController::class, 'deactivateEvent']);
    });

    // Category and Product Routes
    Route::prefix('categories')->group(function () {
        Route::apiResource('/', CategoryController::class);
        Route::get('/limit/{limit}', [CategoryController::class, 'getLimitedCategories']);
    });

    Route::prefix('products')->group(function () {
        Route::get('/search', [ProductController::class, 'searchProducts']);
        Route::get('/category/{category_id}', [ProductController::class, 'getProductsByCategoryId']);
        Route::get('/category/{category_id}/limit/{limit}', [ProductController::class, 'getLimitedProductsByCategoryId']);
        Route::get('/limit/{limit}', [ProductController::class, 'getLimitedProducts']);
        Route::apiResource('/', ProductController::class);
    });

    // User Management Routes
    Route::prefix('users')->group(function () {
        Route::apiResource('admins', AdminController::class);
        Route::apiResource('staffs', StaffController::class);
        Route::apiResource('customers', CustomerController::class);
        Route::middleware('api')->post('customers/auth/login', [CustomerController::class, 'authenticateLoginCustomer']);
    });

    // Product Favorite Routes
    Route::prefix('product-favorites')->group(function () {
        Route::apiResource('/', ProductFavoriteController::class);
        Route::get('/customer/{customer_id}', [ProductFavoriteController::class, 'getFavoriteProductByCustomerId']);
    });

    // Cart Routes
    Route::prefix('carts')->group(function () {
        Route::apiResource('/', CartController::class);
        Route::get('/{cart_id}', [CartController::class, 'getCartByCartId']);
        Route::get('/all-carts/customer/{customer_id}', [CartController::class, 'getAllCartByCustomerId']);
        Route::get('/not-ordered-carts/customer/{customer_id}', [CartController::class, 'getNotOrderedCartByCustomerId']);
    });

    Route::prefix('cart-details')->group(function () {
        Route::resource('/', CartDetailController::class)->except(['destroy']);
        Route::get('/cart/{cart_id}', [CartDetailController::class, 'getCartDetailByCartId']);
        Route::get('/all-cart-details/customer/{customer_id}', [CartDetailController::class, 'getAllCartDetailByCustomerId']);
        Route::get('/not-ordered-cart-details/customer/{customer_id}', [CartDetailController::class, 'getNotOrderedCartDetailByCustomerId']);
        Route::delete('/delete-item-in-cart/{cart_detail_id}', [CartDetailController::class, 'deleteItemInCart']);
    });

    // Order Routes
    Route::prefix('orders')->group(function () {
        Route::apiResource('/', OrderController::class);
        Route::apiResource('details', OrderDetailController::class);
    });

    // Review Routes
    Route::prefix('reviews')->group(function () {
        Route::apiResource('/', ReviewController::class);
        Route::get('/product/{product_id}', [ReviewController::class, 'getReviewsByProductId']);
        Route::get('/status/pending', [ReviewController::class, 'getPendingReviews']);
        Route::get('/status/approved', [ReviewController::class, 'getApprovedReviews']);
        Route::get('/status/unpublished', [ReviewController::class, 'getUnpublishedReviews']);
        Route::put('/publish/{review_id}', [ReviewController::class, 'publishReview']);
        Route::put('/unpublish/{review_id}', [ReviewController::class, 'unpublishReview']);
    });

    // Authenticated User Routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');
});
