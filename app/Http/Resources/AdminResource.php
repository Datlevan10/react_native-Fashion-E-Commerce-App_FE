<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
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
            'admin_id' => $this->admin_id,
            'user_name' => $this->user_name,
            'full_name' => $this->full_name,
            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth,
            'image' => $this->image,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'address' => $this->address,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'last_login' => $this->last_login,
            'permissions' => $this->permissions,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
