<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
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
                'message' => 'Get admin success',
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
            'user_name' => [
                'required',
                'string',
                'max:255',
                'unique:admins,user_name',
                'regex:/^[a-zA-Z0-9_]+$/',
            ],
            'full_name' => 'required|string|max:255',
            'gender' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'email' => ['required', 'string', 'email', 'regex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i', 'unique:admins,email'],
            'phone_number' => ['required', 'string', 'regex:/^[0-9]{10}$/', 'unique:admins,phone_number'],
            'password' => 'required|string|min:8',
            'address' => 'nullable|string|max:255',
        ]);

        $date_of_birth = null;
        if ($request->date_of_birth) {
            if (Carbon::hasFormat($request->date_of_birth, 'd/m/Y')) {
                $date_of_birth = Carbon::createFromFormat('d/m/Y', $request->date_of_birth)->format('Y-m-d');
            } elseif (Carbon::hasFormat($request->date_of_birth, 'd-m-Y')) {
                $date_of_birth = Carbon::createFromFormat('d-m-Y', $request->date_of_birth)->format('Y-m-d');
            } elseif (Carbon::hasFormat($request->date_of_birth, 'Y/m/d')) {
                $date_of_birth = Carbon::createFromFormat('Y/m/d', $request->date_of_birth)->format('Y-m-d');
            } elseif (Carbon::hasFormat($request->date_of_birth, 'Y-m-d')) {
                $date_of_birth = Carbon::createFromFormat('Y-m-d', $request->date_of_birth)->format('Y-m-d');
            } else {
                return response()->json([
                    'message' => 'Invalid date format. Accepted formats are d/m/Y, d-m-Y, Y/m/d, Y-m-d.',
                ], 422);
            }
        }

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

        $hashed_password = Hash::make($request->password);

        // Handle image with Storage
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('admins', $imageName, 'public');
            $imageUrl = Storage::url($imagePath);
        }

        $admins = Admin::create([
            'user_name' => $request->user_name,
            'full_name' => $request->full_name,
            'gender' => $request->gender,
            'date_of_birth' => $date_of_birth,
            'image' => $imageUrl ?? null,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => $hashed_password,
            'address' => $request->address,
        ]);

        return response()->json([
            'message' => 'Admin created success',
            'data' => new AdminResource($admins)
        ], 200);
    }

    // method GET Detail
    public function show($admin_id)
    {
        try {
            $admin = Admin::where('admin_id', $admin_id)->first();
            if (!$admin) {
                return response()->json([
                    'message' => 'Admin not found',
                    'admin_id' => $admin_id
                ], 404);
            }

            return response()->json([
                'message' => 'Get admin success with admin_id',
                'data' => new AdminResource($admin)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get admin information', [
                'error' => $e->getMessage(),
                'admin_id' => $admin_id
            ]);

            return response()->json([
                'message' => 'Failed to get admin information',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // method PUT
    public function update(Request $request, Admin $admin)
    {

        $validator = Validator::make($request->all(), [
            'user_name' => [
                'sometimes',
                'string',
                'max:255',
                'unique:admins,user_name',
                'regex:/^[a-zA-Z0-9_]+$/',
            ],
            'full_name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|string|max:255',
            'date_of_birth' => 'sometimes|date',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'email' => ['sometimes', 'string', 'email', 'regex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i', 'unique:admins,email'],
            'phone_number' => ['sometimes', 'string', 'regex:/^[0-9]{10}$/', 'unique:admins,phone_number'],
            'password' => 'sometimes|string|min:8',
            'address' => 'sometimes|string|max:255',
        ]);

        if ($request->date_of_birth) {
            if (Carbon::hasFormat($request->date_of_birth, 'd/m/Y')) {
                $date_of_birth = Carbon::createFromFormat('d/m/Y', $request->date_of_birth)->format('Y-m-d');
            } elseif (Carbon::hasFormat($request->date_of_birth, 'd-m-Y')) {
                $date_of_birth = Carbon::createFromFormat('d-m-Y', $request->date_of_birth)->format('Y-m-d');
            } elseif (Carbon::hasFormat($request->date_of_birth, 'Y/m/d')) {
                $date_of_birth = Carbon::createFromFormat('Y/m/d', $request->date_of_birth)->format('Y-m-d');
            } elseif (Carbon::hasFormat($request->date_of_birth, 'Y-m-d')) {
                $date_of_birth = Carbon::createFromFormat('Y-m-d', $request->date_of_birth)->format('Y-m-d');
            }
        }

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

        $hashed_password = Hash::make($request->password);

        // Handle image with Storage
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('admins', $imageName, 'public');
            $imageUrl = Storage::url($imagePath);
        }

        $admin->update([
            'user_name' => $request->user_name ?? $admin->user_name,
            'full_name' => $request->full_name ?? $admin->full_name,
            'gender' => $request->gender ?? $admin->gender,
            'date_of_birth' => $date_of_birth ?? $admin->date_of_birth,
            'image' => $imageUrl ?? $admin->image,
            'email' => $request->email ?? $admin->email,
            'phone_number' => $request->phone_number ?? $admin->phone_number,
            'password' => $hashed_password ?? $admin->password,
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
