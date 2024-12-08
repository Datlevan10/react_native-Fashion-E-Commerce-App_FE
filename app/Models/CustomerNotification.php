<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CustomerNotification extends Model
{
    use HasFactory;

    protected $table = 'customer_notifications';

    protected $primaryKey = 'customer_notification_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'notification_id',
        'customer_id',
        'is_hidden',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($customer_notification) {
            $customer_notification->customer_notification_id = Str::random(8);
        });
    }
}
