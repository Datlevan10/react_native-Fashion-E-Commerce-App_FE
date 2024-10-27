<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\StaffResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class StaffController extends Controller
{
    // method GET
    public function index()
    {
        $staffs = Staff::get();
        if ($staffs->count() > 0) {
            return response()->json([
                // 'message' => 'Get Staff success',
                'data' => StaffResource::collection($staffs)
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
                'unique:staffs,user_name',
                'regex:/^[a-zA-Z0-9_]+$/',
            ],
            'full_name' => 'required|string|max:255',
            'gender' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'email' => ['required', 'string', 'email', 'regex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i', 'unique:staffs,email'],
            'phone_number' => ['required', 'string', 'regex:/^[0-9]{10}$/', 'unique:staffs,phone_number'],
            'password' => 'required|string|min:8',
            'address' => 'required|string|max:255',
            'hire_date' => 'nullable|date',
            'salary' => 'nullable|numeric|min:0',
            'department' => 'nullable|string|max:255',
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

        $hire_date = null;
        if ($request->hire_date) {
            if (Carbon::hasFormat($request->hire_date, 'd/m/Y')) {
                $hire_date = Carbon::createFromFormat('d/m/Y', $request->hire_date)->format('Y-m-d');
            } elseif (Carbon::hasFormat($request->hire_date, 'd-m-Y')) {
                $hire_date = Carbon::createFromFormat('d-m-Y', $request->hire_date)->format('Y-m-d');
            } elseif (Carbon::hasFormat($request->hire_date, 'Y/m/d')) {
                $hire_date = Carbon::createFromFormat('Y/m/d', $request->hire_date)->format('Y-m-d');
            } elseif (Carbon::hasFormat($request->hire_date, 'Y-m-d')) {
                $hire_date = Carbon::createFromFormat('Y-m-d', $request->hire_date)->format('Y-m-d');
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
            $imagePath = $image->storeAs('staffs', $imageName, 'public');
            $imageUrl = Storage::url($imagePath);
        }

        $staffs = Staff::create([
            'user_name' => $request->user_name,
            'full_name' => $request->full_name,
            'gender' => $request->gender,
            'date_of_birth' => $date_of_birth,
            'image' => $imageUrl ?? null,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => $hashed_password,
            'address' => $request->address,
            'hire_date' => $hire_date,
            'salary' => $request->salary,
            'department' => $request->department,
        ]);

        return response()->json([
            'message' => 'Staff created success',
            'data' => new StaffResource($staffs)
        ], 201);
    }

    // method GET Detail with staff_id
    public function show($staff_id)
    {
        try {
            $staff = Staff::where('staff_id', $staff_id)->first();
            if (!$staff) {
                return response()->json([
                    'message' => 'Staff not found',
                    'staff_id' => $staff_id
                ], 404);
            }

            return response()->json([
                'message' => 'Get staff success with staff_id',
                'data' => new StaffResource($staff)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to get staff information', [
                'error' => $e->getMessage(),
                'staff_id' => $staff_id
            ]);

            return response()->json([
                'message' => 'Failed to get staff information',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // method PUT
    public function update(Request $request, Staff $staff)
    {
        $validator = Validator::make($request->all(), [
            'user_name' => [
                'sometimes',
                'string',
                'max:255',
                'unique:staffs,user_name,' . $staff->id,
                'regex:/^[a-zA-Z0-9_]+$/',
            ],
            'full_name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|string|max:255',
            'date_of_birth' => 'sometimes|date',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'email' => ['sometimes', 'string', 'email', 'regex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i', 'unique:staffs,email,' . $staff->id],
            'phone_number' => ['sometimes', 'string', 'regex:/^[0-9]{10}$/', 'unique:staffs,phone_number,' . $staff->id],
            'password' => 'sometimes|string|min:8',
            'address' => 'sometimes|string|max:255',
            'hire_date' => 'sometimes|date',
            'salary' => 'sometimes|numeric|min:0',
            'department' => 'sometimes|string|max:255',
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

        if ($request->hire_date) {
            if (Carbon::hasFormat($request->hire_date, 'd/m/Y')) {
                $hire_date = Carbon::createFromFormat('d/m/Y', $request->hire_date)->format('Y-m-d');
            } elseif (Carbon::hasFormat($request->hire_date, 'd-m-Y')) {
                $hire_date = Carbon::createFromFormat('d-m-Y', $request->hire_date)->format('Y-m-d');
            } elseif (Carbon::hasFormat($request->hire_date, 'Y/m/d')) {
                $hire_date = Carbon::createFromFormat('Y/m/d', $request->hire_date)->format('Y-m-d');
            } elseif (Carbon::hasFormat($request->hire_date, 'Y-m-d')) {
                $hire_date = Carbon::createFromFormat('Y-m-d', $request->hire_date)->format('Y-m-d');
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

        $hashed_password = $request->password ? Hash::make($request->password) : $staff->password;

        // Handle image with Storage
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('staffs', $imageName, 'public');
            $imageUrl = Storage::url($imagePath);
        }

        $staff->update([
            'user_name' => $request->user_name ?? $staff->user_name,
            'full_name' => $request->full_name ?? $staff->full_name,
            'gender' => $request->gender ?? $staff->gender,
            'date_of_birth' => $date_of_birth ?? $staff->date_of_birth,
            'image' => $imageUrl ?? $staff->image,
            'email' => $request->email ?? $staff->email,
            'phone_number' => $request->phone_number ?? $staff->phone_number,
            'password' => $hashed_password,
            'address' => $request->address ?? $staff->address,
            'hire_date' => $hire_date ?? $staff->hire_date,
            'salary' => $request->salary ?? $staff->salary,
            'department' => $request->department ?? $staff->department,
        ]);

        return response()->json([
            'message' => 'Staff updated successfully',
            'data' => new StaffResource($staff)
        ], 200);
    }

    // method DELETE
    public function destroy(Staff $staff)
    {
        if ($staff->image) {
            $imagePaths = json_decode($staff->image);
            foreach ($imagePaths as $imagePath) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $imagePath));
            }
        }

        $staff->delete();

        return response()->json([
            'message' => 'Staff deleted successfully',
        ], 200);
    }
}
