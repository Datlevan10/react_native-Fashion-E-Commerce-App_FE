<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        $relatedData = null;

        if ($this->type === 'products') {
            $relatedData = $this->product ? [
                'product_name' => $this->product->product_name,
                'image' => $this->product->image,
                'price' => $this->product->new_price,
            ] : null;
        } elseif ($this->type === 'orders') {
            $relatedData = $this->order ? [
                'order_status' => $this->order->order_status,
                'total_price' => $this->order->total_price,
            ] : null;
        }

        return [
            'notification_id' => $this->notification_id,
            'customer_id' => $this->customer_id,
            'type' => $this->type,
            'related_id' => $this->related_id,
            'message' => $this->message,
            'is_read' => $this->is_read,
            'related_data' => $relatedData,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
