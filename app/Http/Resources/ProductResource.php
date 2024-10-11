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
            'productId' => $this->productId,
            'categoryId' => $this->categoryId,
            'productName' => $this->productName,
            'description' => $this->description,
            'color' => $this->color,
            'size' => $this->size,
            'image' => $this->image,
            'oldPrice' => $this->oldPrice,
            'newPrice' => $this->newPrice,
            'totalReview' => $this->ratingCount,
            'averageReview' => $this->color,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
