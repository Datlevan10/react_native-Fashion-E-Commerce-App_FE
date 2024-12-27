<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingWidgetNoReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'no_review_id' => $this->no_review_id,
            'admin_id' => $this->admin_id,
            'store_id' => $this->store_id,
            'no_review_title_text' => $this->no_review_title_text,
            'no_review_subtitle_text' => $this->no_review_subtitle_text,
            'button_text' => $this->button_text,
            'widget_no_review_background_color' => $this->widget_no_review_background_color,
            'no_review_title_text_color' => $this->no_review_title_text_color,
            'no_review_subtitle_text_color' => $this->no_review_subtitle_text_color,
            'button_background_color' => $this->button_background_color,
            'button_text_color' => $this->button_text_color,
            'widget_no_review_border_color' => $this->widget_no_review_border_color,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
