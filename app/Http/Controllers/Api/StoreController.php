<?php

namespace App\Http\Controllers\Api;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class StoreController extends Controller
{
    // method GET
    public function index() {
        $stores = Store::get();
        if ($stores->count() > 0) {
            return response()->json([
                'message' => 'Get stores success',
                'data' => StoreResource::collection($stores)
            ], 200);
        }
        else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    // method POST
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'store_name' => 'required|string|unique:stores,store_name',
            'description' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'nullable|string',
            'zip_code' => 'nullable|string|max:10',
            'country' => 'required|string',
            'phone_number' => ['required', 'string', 'regex:/^[0-9]{10}$/', 'unique:stores,phone_number'],
            'email' => ['required', 'string', 'email', 'regex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i', 'unique:stores,email'],
            'logo_url' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'website_url' => 'nullable|url',
            'rating' => 'nullable|numeric|min:0|max:5',
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

        // Handle image with Storage
        if ($request->hasFile('logo_url')) {
            $image = $request->file('logo_url');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('stores', $imageName, 'public');
            $logoUrl = Storage::url($imagePath);
        }

        $store = Store::create([
            'store_name' => $request->store_name,
            'description' => $request->description,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'zip_code' => $request->zip_code,
            'country' => $request->country,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'logo_url' => $logoUrl ?? null,
            'website_url' => $request->website_url,
            'rating' => $request->rating ?? 0.0,
        ]);

        return response()->json([
            'message' => 'Store added successfully',
            'data' => new StoreResource($store)
        ], 201);
    }

    // method PUT
    public function update(Request $request, Store $store) {
        $validator = Validator::make($request->all(), [
            'store_name' => 'sometimes|string|unique:stores,store_name,' . $store->store_id . ',store_id|max:255',
            'description' => 'sometimes|string',
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'state' => 'sometimes|string|max:255',
            'zip_code' => 'sometimes|string|max:10',
            'country' => 'sometimes|string|max:255',
            'phone_number' => ['sometimes', 'string', 'regex:/^[0-9]{10}$/', 'unique:stores,phone_number,' . $store->store_id . ',store_id'],
            'email' => ['sometimes', 'string', 'email', 'unique:stores,email,' . $store->store_id . ',store_id'],
            'logo_url' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'website_url' => 'sometimes|url|max:255',
            'rating' => 'sometimes|numeric|min:0|max:5',
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

        $imageUrl = $store->logo_url;
        if ($request->hasFile('logo_url')) {
            if ($store->logo_url) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $store->logo_url));
            }

            $image = $request->file('logo_url');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('stores', $imageName, 'public');
            $imageUrl = Storage::url($imagePath);
        }

        $store->update([
            'store_name' => $request->store_name ?? $store->store_name,
            'description' => $request->description ?? $store->description,
            'address' => $request->address ?? $store->address,
            'city' => $request->city ?? $store->city,
            'state' => $request->state ?? $store->state,
            'zip_code' => $request->zip_code ?? $store->zip_code,
            'country' => $request->country ?? $store->country,
            'phone_number' => $request->phone_number ?? $store->phone_number,
            'email' => $request->email ?? $store->email,
            'website_url' => $request->website_url ?? $store->website_url,
            'rating' => $request->rating ?? $store->rating,
            'logo_url' => $imageUrl,
        ]);

        return response()->json([
            'message' => 'Store updated successfully',
            'data' => new StoreResource($store),
        ], 200);
    }

    // method GET Detail with store_id
    public function show($store_id) {
        try {
            $store = Store::where('store_id', $store_id)->first();
            if (!$store) {
                return response()->json([
                    'message' => 'Store not found',
                    'store_id' => $store_id
                ], 404);
            }

            return response()->json([
                'message' => 'Get store success with store_id',
                'data' => new StoreResource($store)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get store information', [
                'error' => $e->getMessage(),
                'store_id' => $store_id
            ]);

            return response()->json([
                'message' => 'Failed to get store information',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // method DELETE
    public function destroy(Store $store) {
        if ($store->logo_url) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $store->logo_url));
        }

        $store->delete();

        return response()->json([
            'message' => 'Store deleted successfully',
        ], 200);
    }
}
