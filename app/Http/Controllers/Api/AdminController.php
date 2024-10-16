<?php

namespace App\Http\Controllers\Api;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\AdminResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    // method GET
    public function index()
    {
        $admins = Admin::get();
        if ($admins->count() > 0) {
            return response()->json([
                // 'message' => 'Get admin success',
                'data' => AdminResource::collection($admins)
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
                'unique:admins,userName',
                'regex:/^[a-zA-Z0-9_]+$/',
            ],
            'fullName' => 'required|string|max:255',
            'gender' => 'nullable|string|max:255',
            'dateOfBirth' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'email' => ['required', 'string', 'email', 'regex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i', 'unique:admins,email'],
            'phoneNumber' => ['required', 'string', 'regex:/^[0-9]{10}$/', 'unique:admins,phoneNumber'],
            'passWord' => 'required|string|min:8',
            'address' => 'nullable|string|max:255',
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
            $imagePath = $image->storeAs('admins', $imageName, 'public');
            $imageUrl = Storage::url($imagePath);
        }

        $admins = Admin::create([
            'userName' => $request->userName,
            'fullName' => $request->fullName,
            'gender' => $request->gender,
            'dateOfBirth' => $request->dateOfBirth,
            'image' => $imageUrl ?? null,
            'email' => $request->email,
            'phoneNumber' => $request->phoneNumber,
            'passWord' => $hashedPassword,
            'address' => $request->address,
        ]);

        return response()->json([
            'message' => 'Admin created success',
            'data' => new AdminResource($admins)
        ], 200);
    }

    // method GET Detail
    public function show(Admin $admin)
    {
        return new AdminResource($admin);
    }

    // method PUT
    public function update(Request $request, Admin $admin)
    {

        $validator = Validator::make($request->all(), [
            'userName' => [
                'sometimes',
                'string',
                'max:255',
                'unique:admins,userName',
                'regex:/^[a-zA-Z0-9_]+$/',
            ],
            'fullName' => 'sometimes|string|max:255',
            'gender' => 'sometimes|string|max:255',
            'dateOfBirth' => 'sometimes|string|max:255',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'email' => ['sometimes', 'string', 'email', 'regex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i', 'unique:admins,email'],
            'phoneNumber' => ['sometimes', 'string', 'regex:/^[0-9]{10}$/', 'unique:admins,phoneNumber'],
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
            $imagePath = $image->storeAs('admins', $imageName, 'public');
            $imageUrl = Storage::url($imagePath);
        }

        $admin->update([
            'userName' => $request->userName ?? $admin->userName,
            'fullName' => $request->fullName ?? $admin->fullName,
            'gender' => $request->gender ?? $admin->gender,
            'dateOfBirth' => $request->dateOfBirth ?? $admin->dateOfBirth,
            'image' => $imageUrl ?? $admin->image,
            'email' => $request->email ?? $admin->email,
            'phoneNumber' => $request->phoneNumber ?? $admin->phoneNumber,
            'passWord' => $hashedPassword ?? $admin->passWord,
            'address' => $request->address ?? $admin->address,
        ]);

        return response()->json([
            'message' => 'Admin updated success',
            'data' => new AdminResource($admin)
        ], 200);
    }

    // method DELETE
    public function destroy(Admin $admin)
    {
        if ($admin->image) {
            $imagePaths = json_decode($admin->image);
            foreach ($imagePaths as $imagePath) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $imagePath));
            }
        }

        $admin->delete();

        return response()->json([
            'message' => 'Admin deleted successfully',
        ], 200);
    }
}
