<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    protected $primaryKey = 'event_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'event_image' => 'array',
    ];

    protected $fillable = [
        'event_name',
        'description',
        'event_image',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            $event->event_id = Str::random(8);
        });
    }
}
