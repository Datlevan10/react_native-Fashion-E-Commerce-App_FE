<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $primaryKey = 'product_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'color' => 'array',
        'size' => 'array',
        'image' => 'array',
    ];

    protected $fillable = [
        'category_id',
        'product_name',
        'description',
        'color',
        'size',
        'image',
        'old_price',
        'new_price',
        'note',
        'rating_count',
        'rating_average',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            $last_product = Product::orderBy('product_id', 'desc')->first();
            $nextId = 1;

            if ($last_product) {
                $lastId = intval(str_replace('product', '', $last_product->product_id));
                $nextId = $lastId + 1;
            }

            $product->product_id = 'product' . $nextId;
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }
}
