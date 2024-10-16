<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'product_id' => $this->product_id,
            'category_id' => $this->category_id,
            'product_name' => $this->product_name,
            'description' => $this->description,
            'color' => $this->color,
            'size' => $this->size,
            'image' => $this->image,
            'old_price' => $this->old_price,
            'new_price' => $this->new_price,
            // Handle data when returning json (490000.00 -> 490000)
            // 'old_price' => rtrim(rtrim($this->old_price, '0'), '.'),
            // 'new_price' => rtrim(rtrim($this->new_price, '0'), '.'),
            'total_review' => $this->total_review,
            'average_review' => $this->average_review,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
