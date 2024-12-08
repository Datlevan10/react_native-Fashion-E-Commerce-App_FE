<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerNotificationResource extends JsonResource
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
            'customer_notification_id' => $this->customer_notification_id,
            'notification_id' => $this->notification_id,
            'customer_id' => $this->customer_id,
            'is_hidden' => $this->is_hidden,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
