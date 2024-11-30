<?php

namespace App\Models;

use Illuminate\Support\Str;
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
            $product->product_id = Str::random(8);
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }
}
