<?php

namespace App\Http\Controllers\Api;

use App\Models\ReportReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReportReviewResource;

class ReportReviewController extends Controller
{
    // method GET
    public function index()
    {
        $report_reviews = ReportReview::get();
        if ($report_reviews->count() > 0) {
            return response()->json([
                'message' => 'Get report reviews success',
                'data' => ReportReviewResource::collection($report_reviews)
            ], 200);
        } else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    // method POST
    public function store(Request $request)
    {
        $request->validate([
            'review_id' => 'required|string',
            'report_reason' => 'required|string',
        ]);

        $reporterType = 'guest';

        if (!empty($request->reporter_id)) {
            if (DB::table('customers')->where('customer_id', $request->reporter_id)->exists()) {
                $reporterType = 'customer';
            } elseif (DB::table('admins')->where('admin_id', $request->reporter_id)->exists()) {
                $reporterType = 'admin';
            } elseif (DB::table('staffs')->where('staff_id', $request->reporter_id)->exists()) {
                $reporterType = 'staff';
            }
        }

        $report_review = ReportReview::create([
            'review_id' => $request->review_id,
            'reporter_id' => $request->reporter_id ?? null,
            'reporter_type' => $reporterType,
            'report_reason' => $request->report_reason,
            'status' => 'pending',
            'reported_at' => now(),
        ]);

        if ($report_review) {
            return response()->json([
                'message' => 'Report review success',
                'data' => new ReportReviewResource($report_review)
            ], 201);
        } else {
            return response()->json(['message' => 'Report review failed'], 400);
        }
    }
}
