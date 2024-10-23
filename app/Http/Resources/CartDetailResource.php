<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartDetailResource extends JsonResource
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
            'cart_detail_id' => $this->cart_detail_id,
            'cart_id' => $this->cart_id,
            'customer_id' => $this->customer_id,
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'quantity' => $this->quantity,
            'color' => $this->color,
            'size' => $this->size,
            'image' => $this->image,
            'unit_price' => $this->unit_price,
            'total_price' => $this->total_price,
            'is_checked_out' => $this->is_checked_out,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
