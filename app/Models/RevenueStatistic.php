<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RevenueStatistic extends Model
{
    use HasFactory;

    protected $table = 'revenue_statistics';

    protected $primaryKey = 'revenue_statistic_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'date',
        'period_type',
        'total_revenue',
        'total_orders_count',
        'average_order_value',
        'total_refunds',
        'net_revenue',
        'new_customers_count',
        'returning_customers_count',
    ];

    protected $casts = [
        'date' => 'date',
        'total_revenue' => 'decimal:2',
        'average_order_value' => 'decimal:2',
        'total_refunds' => 'decimal:2',
        'net_revenue' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($revenueStatistic) {
            $revenueStatistic->revenue_statistic_id = Str::random(8);
        });
    }
}