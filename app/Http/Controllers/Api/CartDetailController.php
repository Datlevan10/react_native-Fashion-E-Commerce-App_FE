<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartDetailResource;
use App\Models\CartDetail;
use Illuminate\Http\Request;

class CartDetailController extends Controller
{
    // method GET
    public function index() {
        $cart_details = CartDetail::get();
        if ($cart_details->count() > 0) {
            return response()->json([
                // 'message' => 'Get cart detail success',
                'data' => CartDetailResource::collection($cart_details)
            ], 200);
        }
        else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }
}
