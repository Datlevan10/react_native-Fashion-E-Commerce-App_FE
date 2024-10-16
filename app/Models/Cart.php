<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $table = 'carts';

    protected $primaryKey = 'cart_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'customer_id',
        'cart_status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($cart) {
            $last_cart = cart::orderBy('cart_id', 'desc')->first();
            $nextId = 1;

            if ($last_cart) {
                $lastId = intval(str_replace('cart', '', $last_cart->cart_id));
                $nextId = $lastId + 1;
            }

            $cart->cart_id = 'cart' . $nextId;
        });
    }
}
