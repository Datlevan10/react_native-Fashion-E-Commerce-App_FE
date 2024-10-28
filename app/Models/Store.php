<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $table = 'stores';

    protected $primaryKey = 'store_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'store_name',
        'description',
        'address',
        'city',
        'state',
        'zip_code',
        'country',
        'phone_number',
        'email',
        'logo_url',
        'website_url',
        'rating',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($store) {
            $last_store = Store::orderBy('store_id', 'desc')->first();
            $nextId = 1;

            if ($last_store) {
                $lastId = intval(str_replace('store', '', $last_store->store_id));
                $nextId = $lastId + 1;
            }

            $store->store_id = 'store' . $nextId;
        });
    }
}
