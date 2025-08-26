<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerStatisticResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'customer_statistic_id' => $this->customer_statistic_id,
            'customer_id' => $this->customer_id,
            'total_orders_count' => $this->total_orders_count,
            'total_spent' => $this->total_spent,
            'average_order_value' => $this->average_order_value,
            'last_order_date' => $this->last_order_date,
            'favorite_category_id' => $this->favorite_category_id,
            'loyalty_tier' => $this->loyalty_tier,
            'total_reviews_count' => $this->total_reviews_count,
            'average_review_rating' => $this->average_review_rating,
            'cancelled_orders_count' => $this->cancelled_orders_count,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'customer' => $this->whenLoaded('customer'),
            'favorite_category' => $this->whenLoaded('favoriteCategory'),
        ];
    }
}