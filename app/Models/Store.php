<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
            $store->store_id = Str::random(8);
        });
    }
}
