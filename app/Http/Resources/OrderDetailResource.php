<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'order_detail_id' => $this->order_detail_id,
            'order_id' => $this->order_id,
            'staff_name' => $this->order->staff->full_name ?? null,
            'customer_name' => $this->order->customer->full_name ?? null,
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'quantity' => $this->quantity,
            'color' => $this->color,
            'size' => $this->size,
            'image' => $this->image,
            'unit_price' => $this->unit_price,
            'total_price' => $this->total_price,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
