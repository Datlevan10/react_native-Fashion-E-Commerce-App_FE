<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
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
            'customerId' => $this->customerId,
            'customerName' => $this->customerName,
            'gender' => $this->gender,
            'dateOfBirth' => $this->dateOfBirth,
            'image' => $this->image,
            'email' => $this->email,
            'phoneNumber' => $this->phoneNumber,
            'passWord' => $this->passWord,
            'address' => $this->address,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
