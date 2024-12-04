<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // method GET
    public function index()
    {
        $notifications = Notification::with(['product', 'order'])->get();
        if ($notifications->isNotEmpty()) {
            return response()->json([
                'data' => NotificationResource::collection($notifications),
            ], 200);
        } else {
            return response()->json([
                'message' => 'No notifications available',
            ], 200);
        }
    }


    // method DELETE
    public function destroy(Notification $notification)
    {
        if ($notification) {
            $notification->delete();
            return response()->json([
                'message' => 'Notification deleted successfully',
            ], 200);
        }

        return response()->json([
            'message' => 'Notification not found',
        ], 404);
    }

}
