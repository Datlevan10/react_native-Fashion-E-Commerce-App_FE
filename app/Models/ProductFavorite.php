<?php

namespace App\Models;

use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductFavorite extends Model
{
    use HasFactory;

    protected $table = 'product_favorites';

    protected $primaryKey = 'product_favorite_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'customer_id',
        'product_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product_favorite) {
            $product_favorite->product_favorite_id = Str::random(8);
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}
