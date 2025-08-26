<?php

namespace App\Http\Controllers\Api;

use App\Models\RevenueStatistic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\RevenueStatisticResource;
use Illuminate\Support\Facades\Validator;

class RevenueStatisticController extends Controller
{
    public function index()
    {
        $revenueStats = RevenueStatistic::orderBy('date', 'desc')->get();
        if ($revenueStats->count() > 0) {
            return response()->json([
                'message' => 'Get revenue statistics success',
                'data' => RevenueStatisticResource::collection($revenueStats)
            ], 200);
        } else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'period_type' => 'required|in:daily,weekly,monthly,yearly',
            'total_revenue' => 'nullable|numeric|min:0',
            'total_orders_count' => 'nullable|integer|min:0',
            'average_order_value' => 'nullable|numeric|min:0',
            'total_refunds' => 'nullable|numeric|min:0',
            'net_revenue' => 'nullable|numeric|min:0',
            'new_customers_count' => 'nullable|integer|min:0',
            'returning_customers_count' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->messages(),
            ], 422);
        }

        try {
            $existingRecord = RevenueStatistic::where('date', $request->date)
                ->where('period_type', $request->period_type)
                ->first();

            if ($existingRecord) {
                return response()->json(['message' => 'Revenue statistic for this date and period already exists'], 409);
            }

            $revenueStatistic = RevenueStatistic::create($request->all());

            return response()->json([
                'message' => 'Revenue statistic created successfully',
                'data' => new RevenueStatisticResource($revenueStatistic)
            ], 201);
        } catch (\Exception $e) {
            Log::error('Revenue statistic creation failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return response()->json(['message' => 'Failed to create revenue statistic', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($revenue_statistic_id)
    {
        try {
            $revenueStatistic = RevenueStatistic::where('revenue_statistic_id', $revenue_statistic_id)->first();
            if (!$revenueStatistic) {
                return response()->json(['message' => 'Revenue statistic not found'], 404);
            }

            return response()->json([
                'message' => 'Get revenue statistic success',
                'data' => new RevenueStatisticResource($revenueStatistic)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get revenue statistic', [
                'error' => $e->getMessage(),
                'revenue_statistic_id' => $revenue_statistic_id
            ]);
            return response()->json(['message' => 'Failed to get revenue statistic', 'error' => $e->getMessage()], 500);
        }
    }

    public function getByPeriod(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'period_type' => 'required|in:daily,weekly,monthly,yearly',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->messages(),
            ], 422);
        }

        try {
            $query = RevenueStatistic::where('period_type', $request->period_type);

            if ($request->start_date) {
                $query->where('date', '>=', $request->start_date);
            }

            if ($request->end_date) {
                $query->where('date', '<=', $request->end_date);
            }

            $revenueStats = $query->orderBy('date', 'desc')->get();

            return response()->json([
                'message' => 'Get revenue statistics by period success',
                'data' => RevenueStatisticResource::collection($revenueStats)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get revenue statistics by period', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return response()->json(['message' => 'Failed to get revenue statistics', 'error' => $e->getMessage()], 500);
        }
    }

    public function getTotalRevenue(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'period_type' => 'nullable|in:daily,weekly,monthly,yearly',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->messages(),
            ], 422);
        }

        try {
            $query = RevenueStatistic::query();

            if ($request->start_date) {
                $query->where('date', '>=', $request->start_date);
            }

            if ($request->end_date) {
                $query->where('date', '<=', $request->end_date);
            }

            if ($request->period_type) {
                $query->where('period_type', $request->period_type);
            }

            $totalStats = $query->select(
                DB::raw('SUM(total_revenue) as total_revenue'),
                DB::raw('SUM(total_orders_count) as total_orders'),
                DB::raw('AVG(average_order_value) as avg_order_value'),
                DB::raw('SUM(total_refunds) as total_refunds'),
                DB::raw('SUM(net_revenue) as net_revenue')
            )->first();

            return response()->json([
                'message' => 'Get total revenue statistics success',
                'data' => $totalStats
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get total revenue statistics', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return response()->json(['message' => 'Failed to get total revenue statistics', 'error' => $e->getMessage()], 500);
        }
    }
}