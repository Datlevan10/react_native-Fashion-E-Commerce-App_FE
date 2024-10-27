<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductFavoriteResource extends JsonResource
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
            'product_favorite_id' => $this->product_favorite_id,
            'customer_id' => $this->customer_id,
            'product_id' => $this->product_id,
            'product_name' => $this->product->product_name ?? null,
            'description' => $this->product->description ?? null,
            'color' => $this->product->color ?? null,
            'size' => $this->product->size ?? null,
            'image' => $this->product->image ?? null,
            'old_price' => $this->product->old_price ?? null,
            'new_price' => $this->product->new_price ?? null,
            'total_review' => $this->product->total_review ?? null,
            'average_review' => $this->product->average_review ?? null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
