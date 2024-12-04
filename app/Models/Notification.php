<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $primaryKey = 'notification_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'customer_id',
        'type',
        'related_id',
        'message',
        'is_read',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($notification) {
            $notification->notification_id = Str::random(8);
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'related_id', 'product_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'related_id', 'order_id');
    }
}
