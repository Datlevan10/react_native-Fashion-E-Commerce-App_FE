<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductStatistic extends Model
{
    use HasFactory;

    protected $table = 'product_statistics';

    protected $primaryKey = 'product_statistic_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'product_id',
        'total_sold_quantity',
        'total_revenue',
        'average_rating',
        'total_reviews_count',
        'view_count',
        'wishlist_count',
        'last_updated',
    ];

    protected $casts = [
        'total_revenue' => 'decimal:2',
        'average_rating' => 'decimal:2',
        'last_updated' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($productStatistic) {
            $productStatistic->product_statistic_id = Str::random(8);
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}