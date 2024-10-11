<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $primaryKey = 'productId';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'color' => 'array',
        'size' => 'array',
        'image' => 'array',
    ];

    protected $fillable = [
        'categoryId',
        'productName',
        'description',
        'color',
        'size',
        'image',
        'oldPrice',
        'newPrice',
        'ratingCount',
        'ratingAverage',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            $lastProduct = Product::orderBy('productId', 'desc')->first();
            $nextId = 1;

            if ($lastProduct) {
                $lastId = intval(str_replace('product', '', $lastProduct->productId));
                $nextId = $lastId + 1;
            }

            $product->productId = 'product' . $nextId;
        });
    }
}
