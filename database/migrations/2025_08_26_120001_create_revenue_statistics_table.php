<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('revenue_statistics', function (Blueprint $table) {
            $table->string('revenue_statistic_id')->primary();
            $table->date('date');
            $table->enum('period_type', ['daily', 'weekly', 'monthly', 'yearly'])->default('daily');
            $table->decimal('total_revenue', 15, 2)->default(0);
            $table->integer('total_orders_count')->default(0);
            $table->decimal('average_order_value', 10, 2)->default(0);
            $table->decimal('total_refunds', 15, 2)->default(0);
            $table->decimal('net_revenue', 15, 2)->default(0);
            $table->integer('new_customers_count')->default(0);
            $table->integer('returning_customers_count')->default(0);
            $table->timestamps();

            $table->index(['date', 'period_type']);
            $table->unique(['date', 'period_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('revenue_statistics');
    }
};