<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
            $last_event = Event::orderBy('event_id', 'desc')->first();
            $nextId = 1;

            if ($last_event) {
                $lastId = intval(str_replace('event', '', $last_event->event_id));
                $nextId = $lastId + 1;
            }

            $event->event_id = 'event' . $nextId;
        });
    }
}
