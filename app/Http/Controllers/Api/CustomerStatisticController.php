<?php

namespace App\Http\Controllers\Api;

use App\Models\CustomerStatistic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerStatisticResource;
use Illuminate\Support\Facades\Validator;

class CustomerStatisticController extends Controller
{
    public function index()
    {
        $customerStats = CustomerStatistic::with(['customer', 'favoriteCategory'])->get();
        if ($customerStats->count() > 0) {
            return response()->json([
                'message' => 'Get customer statistics success',
                'data' => CustomerStatisticResource::collection($customerStats)
            ], 200);
        } else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:customers,customer_id|unique:customer_statistics,customer_id',
            'total_orders_count' => 'nullable|integer|min:0',
            'total_spent' => 'nullable|numeric|min:0',
            'average_order_value' => 'nullable|numeric|min:0',
            'last_order_date' => 'nullable|date',
            'favorite_category_id' => 'nullable|exists:categories,category_id',
            'loyalty_tier' => 'nullable|in:bronze,silver,gold,platinum',
            'total_reviews_count' => 'nullable|integer|min:0',
            'average_review_rating' => 'nullable|numeric|min:0|max:5',
            'cancelled_orders_count' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->messages(),
            ], 422);
        }

        try {
            $customerStatistic = CustomerStatistic::create($request->all());

            return response()->json([
                'message' => 'Customer statistic created successfully',
                'data' => new CustomerStatisticResource($customerStatistic)
            ], 201);
        } catch (\Exception $e) {
            Log::error('Customer statistic creation failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return response()->json(['message' => 'Failed to create customer statistic', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($customer_statistic_id)
    {
        try {
            $customerStatistic = CustomerStatistic::with(['customer', 'favoriteCategory'])
                ->where('customer_statistic_id', $customer_statistic_id)
                ->first();
            if (!$customerStatistic) {
                return response()->json(['message' => 'Customer statistic not found'], 404);
            }

            return response()->json([
                'message' => 'Get customer statistic success',
                'data' => new CustomerStatisticResource($customerStatistic)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get customer statistic', [
                'error' => $e->getMessage(),
                'customer_statistic_id' => $customer_statistic_id
            ]);
            return response()->json(['message' => 'Failed to get customer statistic', 'error' => $e->getMessage()], 500);
        }
    }

    public function getByCustomerId($customer_id)
    {
        try {
            $customerStatistic = CustomerStatistic::with(['customer', 'favoriteCategory'])
                ->where('customer_id', $customer_id)
                ->first();
            if (!$customerStatistic) {
                return response()->json(['message' => 'Customer statistic not found'], 404);
            }

            return response()->json([
                'message' => 'Get customer statistic by customer_id success',
                'data' => new CustomerStatisticResource($customerStatistic)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get customer statistic by customer_id', [
                'error' => $e->getMessage(),
                'customer_id' => $customer_id
            ]);
            return response()->json(['message' => 'Failed to get customer statistic', 'error' => $e->getMessage()], 500);
        }
    }

    public function getTopSpenders($limit = 10)
    {
        try {
            $topSpenders = CustomerStatistic::with(['customer', 'favoriteCategory'])
                ->orderBy('total_spent', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'message' => 'Get top spending customers success',
                'data' => CustomerStatisticResource::collection($topSpenders)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get top spending customers', [
                'error' => $e->getMessage(),
            ]);
            return response()->json(['message' => 'Failed to get top spending customers', 'error' => $e->getMessage()], 500);
        }
    }

    public function getByLoyaltyTier($loyalty_tier)
    {
        $validator = Validator::make(['loyalty_tier' => $loyalty_tier], [
            'loyalty_tier' => 'required|in:bronze,silver,gold,platinum',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid loyalty tier',
                'errors' => $validator->messages(),
            ], 422);
        }

        try {
            $customers = CustomerStatistic::with(['customer', 'favoriteCategory'])
                ->where('loyalty_tier', $loyalty_tier)
                ->get();

            return response()->json([
                'message' => "Get {$loyalty_tier} tier customers success",
                'data' => CustomerStatisticResource::collection($customers)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get customers by loyalty tier', [
                'error' => $e->getMessage(),
                'loyalty_tier' => $loyalty_tier
            ]);
            return response()->json(['message' => 'Failed to get customers by loyalty tier', 'error' => $e->getMessage()], 500);
        }
    }

    public function updateStatistic(Request $request, $customer_statistic_id)
    {
        $validator = Validator::make($request->all(), [
            'total_orders_count' => 'nullable|integer|min:0',
            'total_spent' => 'nullable|numeric|min:0',
            'average_order_value' => 'nullable|numeric|min:0',
            'last_order_date' => 'nullable|date',
            'favorite_category_id' => 'nullable|exists:categories,category_id',
            'loyalty_tier' => 'nullable|in:bronze,silver,gold,platinum',
            'total_reviews_count' => 'nullable|integer|min:0',
            'average_review_rating' => 'nullable|numeric|min:0|max:5',
            'cancelled_orders_count' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->messages(),
            ], 422);
        }

        try {
            $customerStatistic = CustomerStatistic::where('customer_statistic_id', $customer_statistic_id)->first();
            if (!$customerStatistic) {
                return response()->json(['message' => 'Customer statistic not found'], 404);
            }

            $customerStatistic->update($request->all());

            return response()->json([
                'message' => 'Customer statistic updated successfully',
                'data' => new CustomerStatisticResource($customerStatistic)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Customer statistic update failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return response()->json(['message' => 'Failed to update customer statistic', 'error' => $e->getMessage()], 500);
        }
    }
}