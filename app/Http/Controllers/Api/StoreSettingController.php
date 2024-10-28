<?php

namespace App\Http\Controllers\Api;

use App\Models\StoreSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\StoreSettingResource;

class StoreSettingController extends Controller
{
    // method GET
    public function index() {
        $store_settings = StoreSetting::get();
        if ($store_settings->count() > 0) {
            return response()->json([
                'message' => 'Get store setting success',
                'data' => StoreSettingResource::collection($store_settings)
            ], 200);
        }
        else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    // method POST
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'store_id' => 'required|string|exists:stores,store_id',
            'is_open' => 'boolean',
            'open_time' => 'nullable|date_format:H:i',
            'close_time' => 'nullable|date_format:H:i',
            'shipping_policies' => 'nullable|array',
            'payment_methods' => 'nullable|array',
            'return_policy' => 'nullable|string',
            'privacy_policy' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', [
                'errors' => $validator->messages(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Field is empty or invalid',
                'error' => $validator->messages(),
            ], 422);
        }

        $storeSetting = StoreSetting::create([
            // 'setting_id' => uniqid(),
            'store_id' => $request->store_id,
            'is_open' => $request->is_open ?? true,
            'open_time' => $request->open_time,
            'close_time' => $request->close_time,
            'shipping_policies' => $request->shipping_policies,
            'payment_methods' => $request->payment_methods,
            'return_policy' => $request->return_policy,
            'privacy_policy' => $request->privacy_policy,
        ]);

        return response()->json([
            'message' => 'Store setting added successfully',
            'data' => new StoreSettingResource($storeSetting)
        ], 201);
    }

    // method PUT
    public function update(Request $request, StoreSetting $storeSetting) {
        $validator = Validator::make($request->all(), [
            'is_open' => 'sometimes|boolean',
            'open_time' => 'sometimes|nullable|date_format:H:i',
            'close_time' => 'sometimes|nullable|date_format:H:i',
            'shipping_policies' => 'sometimes|nullable|array',
            'payment_methods' => 'sometimes|nullable|array',
            'return_policy' => 'sometimes|nullable|string',
            'privacy_policy' => 'sometimes|nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', [
                'errors' => $validator->messages(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Field is empty or invalid',
                'error' => $validator->messages(),
            ], 422);
        }

        $storeSetting->update([
            'is_open' => $request->is_open ?? $storeSetting->is_open,
            'open_time' => $request->open_time ?? $storeSetting->open_time,
            'close_time' => $request->close_time ?? $storeSetting->close_time,
            'shipping_policies' => $request->shipping_policies ?? $storeSetting->shipping_policies,
            'payment_methods' => $request->payment_methods ?? $storeSetting->payment_methods,
            'return_policy' => $request->return_policy ?? $storeSetting->return_policy,
            'privacy_policy' => $request->privacy_policy ?? $storeSetting->privacy_policy,
        ]);

        return response()->json([
            'message' => 'Store setting updated successfully',
            'data' => new StoreSettingResource($storeSetting)
        ], 200);
    }

    // method DELETE
    public function destroy(StoreSetting $storeSetting) {
        $storeSetting->delete();

        return response()->json([
            'message' => 'Store setting deleted successfully',
        ], 200);
    }

}
