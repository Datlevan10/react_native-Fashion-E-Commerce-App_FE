<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderDetailResource;
use App\Models\OrderDetail;
use Illuminate\Http\Request;

class OrderDetailController extends Controller
{
    // method GET
    public function index() {
        $order_details = OrderDetail::get();
        if ($order_details->count() > 0) {
            return response()->json([
                // 'message' => 'Get cart success',
                'data' => OrderDetailResource::collection($order_details)
            ], 200);
        }
        else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }
}
