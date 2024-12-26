<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingWidgetNoReview extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    // public function toArray(Request $request): array
    // {
    //     return parent::toArray($request);
    // }
    public function toArray($request): array
    {
        return [
            'no_review_id' => $this->no_review_id,
            'admin_id' => $this->admin_id,
            'no_review_title' => $this->no_review_title,
            'no_review_subtitle' => $this->no_review_subtitle,
            'button_text' => $this->button_text,
            'widget_no_review_background_color' => $this->widget_no_review_background_color,
            'no_review_title_color' => $this->no_review_title_color,
            'no_review_subtitle_color' => $this->no_review_subtitle_color,
            'button_background_color' => $this->button_background_color,
            'button_text_color' => $this->button_text_color,
            'widget_no_review_border_color' => $this->widget_no_review_border_color,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
