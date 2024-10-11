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
            // Handle data when returning json (490000.00 -> 490000)
            // 'oldPrice' => rtrim(rtrim($this->oldPrice, '0'), '.'),
            // 'newPrice' => rtrim(rtrim($this->newPrice, '0'), '.'),
            'totalReview' => $this->totalReview,
            'averageReview' => $this->averageReview,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
