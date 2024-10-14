<?php

namespace App\Http\Controllers\Api;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\CustomerResource;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    // method GET
    public function index()
    {
        $customers = Customer::get();
        if ($customers->count() > 0) {
            return response()->json([
                // 'message' => 'Get customer success',
                'data' => CustomerResource::collection($customers)
            ], 200);
        } else {
            return response()->json(['message' => 'No record available'], 200);
        }
    }

    // method POST
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'userName' => [
                'required',
                'string',
                'max:255',
                'unique:customers,userName',
                'regex:/^[a-zA-Z0-9_]+$/',
            ],
            'fullName' => 'required|string|max:255',
            'gender' => 'required|string|max:255',
            'dateOfBirth' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'email' => ['required', 'string', 'email', 'regex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i', 'unique:customers,email'],
            'phoneNumber' => ['required', 'string', 'regex:/^[0-9]{10}$/', 'unique:customers,phoneNumber'],
            'passWord' => 'required|string|min:8',
            'address' => 'required|string|max:255',
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

        $hashedPassword = Hash::make($request->passWord);

        // Handle image with Storage
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('customers', $imageName, 'public');
            $imageUrl = Storage::url($imagePath);
        }

        $customers = Customer::create([
            'userName' => $request->userName,
            'fullName' => $request->userName,
            'gender' => $request->gender,
            'dateOfBirth' => $request->dateOfBirth,
            'image' => $imageUrl ?? null,
            'email' => $request->email,
            'phoneNumber' => $request->phoneNumber,
            'passWord' => $hashedPassword,
            'address' => $request->address,
        ]);

        return response()->json([
            'message' => 'Customer created success',
            'data' => new CustomerResource($customers)
        ], 200);
    }

    // method GET Detail
    public function show(Customer $customer)
    {
        return new CustomerResource($customer);
    }

    // method PUT
    public function update(Request $request, Customer $customer)
    {

        $validator = Validator::make($request->all(), [
            'userName' => [
                'sometimes',
                'string',
                'max:255',
                'unique:customers,userName',
                'regex:/^[a-zA-Z0-9_]+$/',
            ],
            'fullName' => 'sometimes|string|max:255',
            'gender' => 'sometimes|string|max:255',
            'dateOfBirth' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'email' => ['sometimes', 'string', 'email', 'regex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i', 'unique:customers,email'],
            'phoneNumber' => ['sometimes', 'string', 'regex:/^[0-9]{10}$/', 'unique:customers,phoneNumber'],
            'passWord' => 'sometimes|string|min:8',
            'address' => 'sometimes|string|max:255',
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

        $hashedPassword = Hash::make($request->passWord);

        // Handle image with Storage
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('customers', $imageName, 'public');
            $imageUrl = Storage::url($imagePath);
        }

        $customer->update([
            'userName' => $request->userName ?? $customer->userName,
            'fullName' => $request->fullName ?? $customer->fullName,
            'gender' => $request->gender ?? $customer->gender,
            'dateOfBirth' => $request->dateOfBirth ?? $customer->dateOfBirth,
            'image' => $imageUrl ?? $customer->image,
            'email' => $request->email ?? $customer->email,
            'phoneNumber' => $request->phoneNumber ?? $customer->phoneNumber,
            'passWord' => $hashedPassword ?? $customer->passWord,
            'address' => $request->address ?? $customer->address,
        ]);

        return response()->json([
            'message' => 'Customer updated success',
            'data' => new CustomerResource($customer)
        ], 200);
    }

    // method DELETE
    public function destroy(Customer $customer)
    {
        if ($customer->image) {
            $imagePaths = json_decode($customer->image);
            foreach ($imagePaths as $imagePath) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $imagePath));
            }
        }

        $customer->delete();

        return response()->json([
            'message' => 'Customer deleted successfully',
        ], 200);
    }
}
