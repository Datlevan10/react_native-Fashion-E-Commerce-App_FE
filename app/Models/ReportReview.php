<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReportReview extends Model
{
    use HasFactory;

    protected $table = 'report_reviews';

    protected $primaryKey = 'report_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'review_id',
        'reporter_id',
        'reporter_type',
        'report_reason',
        'status',
        'reported_at',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($report_review) {
            $report_review->report_id = Str::random(8);
        });
    }
}
