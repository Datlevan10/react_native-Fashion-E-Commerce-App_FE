<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'review_id' => $this->review_id,
            'admin_id' => $this->admin_id,
            'admin_name' => $this->admin ? $this->admin->full_name : null,
            'customer_id' => $this->customer_id,
            'product_id' => $this->product_id,
            'product_name' => $this->product ? $this->product->product_name : null,
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_type' => $this->customer_type,
            'stars_review' => $this->stars_review,
            'review_title' => $this->review_title,
            'review_product' => $this->review_product,
            'total_review' => $this->product ? $this->product->total_review : null,
            'average_review' => $this->product ? $this->product->average_review : null,
            'media' => $this->media,
            'status' => $this->status,
            'review_date' => $this->review_date,
            'reply' => $this->reply,
            'reply_date' => $this->reply_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
