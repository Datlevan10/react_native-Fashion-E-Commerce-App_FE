<?php

namespace App\Models;

use App\Models\Staff;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $primaryKey = 'order_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'customer_id',
        'staff_id',
        'order_date',
        'payment_method',
        'shipping_address',
        'notes',
        'discount',
        'total_price',
        'order_status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            $last_order = Order::orderBy('order_id', 'desc')->first();
            $nextId = 1;

            if ($last_order) {
                $lastId = intval(str_replace('order', '', $last_order->order_id));
                $nextId = $lastId + 1;
            }

            $order->order_id = 'order' . $nextId;
        });
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class, 'staff_id', 'staff_id');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id', 'order_id');
    }
}
