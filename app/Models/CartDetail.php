<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartDetail extends Model
{
    use HasFactory;

    protected $table = 'cart_details';

    protected $primaryKey = 'cart_detail_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'cart_id',
        'customer_id',
        'product_id',
        'product_name',
        'quantity',
        'color',
        'size',
        'image',
        'unit_price',
        'total_price',
        'is_checked_out',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($cart_detail) {
            $last_cart_detail = CartDetail::orderBy('cart_detail_id', 'desc')->first();
            $nextId = 1;

            if ($last_cart_detail) {
                $lastId = intval(str_replace('cart_detail', '', $last_cart_detail->cart_detail_id));
                $nextId = $lastId + 1;
            }

            $cart_detail->cart_detail_id = 'cart_detail' . $nextId;
        });
    }
}
