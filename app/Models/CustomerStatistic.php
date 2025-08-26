<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CustomerStatistic extends Model
{
    use HasFactory;

    protected $table = 'customer_statistics';

    protected $primaryKey = 'customer_statistic_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'customer_id',
        'total_orders_count',
        'total_spent',
        'average_order_value',
        'last_order_date',
        'favorite_category_id',
        'loyalty_tier',
        'total_reviews_count',
        'average_review_rating',
        'cancelled_orders_count',
    ];

    protected $casts = [
        'total_spent' => 'decimal:2',
        'average_order_value' => 'decimal:2',
        'average_review_rating' => 'decimal:2',
        'last_order_date' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($customerStatistic) {
            $customerStatistic->customer_statistic_id = Str::random(8);
        });
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function favoriteCategory()
    {
        return $this->belongsTo(Category::class, 'favorite_category_id', 'category_id');
    }
}