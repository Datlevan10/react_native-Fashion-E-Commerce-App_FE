<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StoreSetting extends Model
{
    use HasFactory;

    protected $table = 'store_settings';

    protected $primaryKey = 'setting_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'shipping_policies' => 'array',-
        'payment_methods' => 'array',
    ];

    protected $fillable = [
        'store_id',
        'is_open',
        'open_time',
        'close_time',
        'shipping_policies',
        'payment_methods',
        'return_policy',
        'privacy_policy',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($store_setting) {
            $store_setting->setting_id = Str::random(8);
        });
    }
}
