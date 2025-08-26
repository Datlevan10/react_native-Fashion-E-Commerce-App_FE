<?php

namespace App\Http\Controllers\Api;

use App\Models\ProductStatistic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductStatisticResource;
use Illuminate\Support\Facades\Validator;

class ProductStatisticController extends Controller
{
    public function index()
    {
        $productStats = ProductStatistic::with('product')->get();
        if ($productStats->count() > 0) {
            return response()->json([
                'message' => 'Get product statistics success',
                'data' => ProductStatisticResource::collection($productStats)
            ], 200);
        } else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,product_id|unique:product_statistics,product_id',
            'total_sold_quantity' => 'nullable|integer|min:0',
            'total_revenue' => 'nullable|numeric|min:0',
            'average_rating' => 'nullable|numeric|min:0|max:5',
            'total_reviews_count' => 'nullable|integer|min:0',
            'view_count' => 'nullable|integer|min:0',
            'wishlist_count' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->messages(),
            ], 422);
        }

        try {
            $productStatistic = ProductStatistic::create($request->all());

            return response()->json([
                'message' => 'Product statistic created successfully',
                'data' => new ProductStatisticResource($productStatistic)
            ], 201);
        } catch (\Exception $e) {
            Log::error('Product statistic creation failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return response()->json(['message' => 'Failed to create product statistic', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($product_statistic_id)
    {
        try {
            $productStatistic = ProductStatistic::with('product')->where('product_statistic_id', $product_statistic_id)->first();
            if (!$productStatistic) {
                return response()->json(['message' => 'Product statistic not found'], 404);
            }

            return response()->json([
                'message' => 'Get product statistic success',
                'data' => new ProductStatisticResource($productStatistic)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get product statistic', [
                'error' => $e->getMessage(),
                'product_statistic_id' => $product_statistic_id
            ]);
            return response()->json(['message' => 'Failed to get product statistic', 'error' => $e->getMessage()], 500);
        }
    }

    public function getByProductId($product_id)
    {
        try {
            $productStatistic = ProductStatistic::with('product')->where('product_id', $product_id)->first();
            if (!$productStatistic) {
                return response()->json(['message' => 'Product statistic not found'], 404);
            }

            return response()->json([
                'message' => 'Get product statistic by product_id success',
                'data' => new ProductStatisticResource($productStatistic)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get product statistic by product_id', [
                'error' => $e->getMessage(),
                'product_id' => $product_id
            ]);
            return response()->json(['message' => 'Failed to get product statistic', 'error' => $e->getMessage()], 500);
        }
    }

    public function getTopSellingProducts($limit = 10)
    {
        try {
            $topProducts = ProductStatistic::with('product')
                ->orderBy('total_sold_quantity', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'message' => 'Get top selling products success',
                'data' => ProductStatisticResource::collection($topProducts)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get top selling products', [
                'error' => $e->getMessage(),
            ]);
            return response()->json(['message' => 'Failed to get top selling products', 'error' => $e->getMessage()], 500);
        }
    }

    public function getTopRevenueProducts($limit = 10)
    {
        try {
            $topRevenueProducts = ProductStatistic::with('product')
                ->orderBy('total_revenue', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'message' => 'Get top revenue products success',
                'data' => ProductStatisticResource::collection($topRevenueProducts)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get top revenue products', [
                'error' => $e->getMessage(),
            ]);
            return response()->json(['message' => 'Failed to get top revenue products', 'error' => $e->getMessage()], 500);
        }
    }

    public function updateStatistic(Request $request, $product_statistic_id)
    {
        $validator = Validator::make($request->all(), [
            'total_sold_quantity' => 'nullable|integer|min:0',
            'total_revenue' => 'nullable|numeric|min:0',
            'average_rating' => 'nullable|numeric|min:0|max:5',
            'total_reviews_count' => 'nullable|integer|min:0',
            'view_count' => 'nullable|integer|min:0',
            'wishlist_count' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->messages(),
            ], 422);
        }

        try {
            $productStatistic = ProductStatistic::where('product_statistic_id', $product_statistic_id)->first();
            if (!$productStatistic) {
                return response()->json(['message' => 'Product statistic not found'], 404);
            }

            $productStatistic->update($request->all());
            $productStatistic->update(['last_updated' => now()]);

            return response()->json([
                'message' => 'Product statistic updated successfully',
                'data' => new ProductStatisticResource($productStatistic)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Product statistic update failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return response()->json(['message' => 'Failed to update product statistic', 'error' => $e->getMessage()], 500);
        }
    }
}