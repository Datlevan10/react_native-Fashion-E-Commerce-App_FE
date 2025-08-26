<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductStatisticResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'product_statistic_id' => $this->product_statistic_id,
            'product_id' => $this->product_id,
            'total_sold_quantity' => $this->total_sold_quantity,
            'total_revenue' => $this->total_revenue,
            'average_rating' => $this->average_rating,
            'total_reviews_count' => $this->total_reviews_count,
            'view_count' => $this->view_count,
            'wishlist_count' => $this->wishlist_count,
            'last_updated' => $this->last_updated,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'product' => $this->whenLoaded('product'),
        ];
    }
}