<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Customer;
use App\Models\CartDetail;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    // method GET
    public function index() {
        $orders = Order::get();
        if ($orders->count() > 0) {
            return response()->json([
                // 'message' => 'Get order success',
                'data' => OrderResource::collection($orders)
            ], 200);
        }
        else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    // method POST
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cart_id' => 'required|exists:carts,cart_id',
            'customer_id' => 'required|exists:customers,customer_id',
            'payment_method' => 'required|string',
            'shipping_address' => 'nullable|string',
            'discount' => 'nullable|numeric|min:0|max:100'
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', [
                'errors' => $validator->messages(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Field is empty or invalid',
                'errors' => $validator->messages(),
            ], 422);
        }

        DB::beginTransaction();

        try {
            $customer = Customer::find($request->customer_id);
            if (!$customer) {
                return response()->json(['message' => 'Customer not found'], 404);
            }

            $cartDetails = CartDetail::where('cart_id', $request->cart_id)
                            ->where('is_checked_out', false)
                            ->get();

            if ($cartDetails->isEmpty()) {
                return response()->json(['message' => 'No items in cart to checkout'], 400);
            }

            $shippingAddress = $request->shipping_address ?? $customer->address;
            $totalPrice = $cartDetails->sum('total_price');

            $order = Order::create([
                'order_id' => 'ORD' . uniqid(),
                'customer_id' => $request->customer_id,
                'order_date' => Carbon::now(),
                'payment_method' => $request->payment_method,
                'shipping_address' => $shippingAddress,
                'discount' => $request->discount ?? 0,
                'total_price' => $totalPrice,
                'order_status' => 'pending'
            ]);

            foreach ($cartDetails as $detail) {
                OrderDetail::create([
                    'order_detail_id' => 'OD' . uniqid(),
                    'order_id' => $order->order_id,
                    'product_id' => $detail->product_id,
                    'product_name' => $detail->product_name,
                    'quantity' => $detail->quantity,
                    'color' => $detail->color,
                    'size' => $detail->size,
                    'image' => $detail->image,
                    'unit_price' => $detail->unit_price,
                    'total_price' => $detail->total_price,
                ]);

                $detail->update(['is_checked_out' => true]);
            }

            $cart = Cart::where('cart_id', $request->cart_id)->first();
            $cart->update(['cart_status' => true]);

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully from cart',
                'data' => new OrderResource($order)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return response()->json(['message' => 'Failed to create order', 'error' => $e->getMessage()], 500);
        }
    }
}
