<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportReviewResource extends JsonResource
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
            'report_id' => $this->report_id,
            'review_id' => $this->review_id,
            'reporter_id' => $this->reporter_id,
            'reporter_type' => $this->reporter_type,
            'report_reason' => $this->report_reason,
            'handled_by' => $this->handled_by,
            'handled_at' => $this->handled_at,
            'status' => $this->status,
            'reported_at' => $this->reported_at,
            'reply' => $this->reply,
            'reply_at' => $this->reply_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
