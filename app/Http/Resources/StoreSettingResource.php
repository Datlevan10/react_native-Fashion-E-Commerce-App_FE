<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreSettingResource extends JsonResource
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
            'setting_id' => $this->setting_id,
            'store_id' => $this->store_id,
            'is_open' => $this->is_open,
            'open_time' => $this->open_time,
            'close_time' => $this->close_time,
            'shipping_policies' => $this->shipping_policies,
            'payment_methods' => $this->payment_methods,
            'return_policy' => $this->return_policy,
            'privacy_policy' => $this->privacy_policy,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
