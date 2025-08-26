<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RevenueStatisticResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'revenue_statistic_id' => $this->revenue_statistic_id,
            'date' => $this->date,
            'period_type' => $this->period_type,
            'total_revenue' => $this->total_revenue,
            'total_orders_count' => $this->total_orders_count,
            'average_order_value' => $this->average_order_value,
            'total_refunds' => $this->total_refunds,
            'net_revenue' => $this->net_revenue,
            'new_customers_count' => $this->new_customers_count,
            'returning_customers_count' => $this->returning_customers_count,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}