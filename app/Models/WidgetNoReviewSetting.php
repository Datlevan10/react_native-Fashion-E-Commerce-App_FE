<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WidgetNoReviewSetting extends Model
{
    use HasFactory;

    protected $table = 'widget_no_reviews_settings';

    protected $primaryKey = 'no_review_setting_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'admin_id',
        'store_id',
        'no_review_title_text',
        'no_review_subtitle_text',
        'button_text',
        'widget_no_review_background_color',
        'no_review_title_text_color',
        'no_review_subtitle_text_color',
        'button_background_color',
        'button_text_color',
        'widget_no_review_border_color',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($no_review) {
            $no_review->no_review_setting_id = Str::random(8);
        });
    }
}
