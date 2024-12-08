<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;

class NotificationController extends Controller
{
    // method GET
    public function index(Request $request)
    {
        $customerId = $request->input('customer_id');
        $notifications = Notification::with(['product', 'order'])
            ->whereDoesntHave('customerNotifications', function ($query) use ($customerId) {
                $query->where('customer_id', $customerId)
                    ->where('is_hidden', true);
            })
            ->get();

        if ($notifications->isNotEmpty()) {
            return response()->json([
                'message' => 'Get notification success',
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

    // method hide notification
    public function hideNotification(Request $request, $notificationId)
    {
        $customerId = $request->input('customer_id');

        $customerNotification = DB::table('customer_notifications')
            ->where('notification_id', $notificationId)
            ->where('customer_id', $customerId)
            ->first();

        if (!$customerNotification) {
            DB::table('customer_notifications')->insert([
                'customer_notification_id' => \Illuminate\Support\Str::random(8),
                'notification_id' => $notificationId,
                'customer_id' => $customerId,
                'is_hidden' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            DB::table('customer_notifications')
                ->where('notification_id', $notificationId)
                ->where('customer_id', $customerId)
                ->update(['is_hidden' => true, 'updated_at' => now()]);
        }

        return response()->json(['message' => 'Notification hidden successfully'], 200);
    }


}
