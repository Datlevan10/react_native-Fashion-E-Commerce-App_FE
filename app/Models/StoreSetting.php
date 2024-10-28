<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreSetting extends Model
{
    use HasFactory;

    protected $table = 'store_settings';

    protected $primaryKey = 'setting_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'shipping_policies' => 'array',
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
            $last_store_setting = StoreSetting::orderBy('setting_id', 'desc')->first();
            $nextId = 1;

            if ($last_store_setting) {
                $lastId = intval(str_replace('store_setting', '', $last_store_setting->setting_id));
                $nextId = $lastId + 1;
            }

            $store_setting->setting_id = 'store_setting' . $nextId;
        });
    }
}
