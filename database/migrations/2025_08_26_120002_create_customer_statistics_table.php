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
        Schema::create('customer_statistics', function (Blueprint $table) {
            $table->string('customer_statistic_id')->primary();
            $table->string('customer_id');
            $table->integer('total_orders_count')->default(0);
            $table->decimal('total_spent', 15, 2)->default(0);
            $table->decimal('average_order_value', 10, 2)->default(0);
            $table->timestamp('last_order_date')->nullable();
            $table->string('favorite_category_id')->nullable();
            $table->enum('loyalty_tier', ['bronze', 'silver', 'gold', 'platinum'])->default('bronze');
            $table->integer('total_reviews_count')->default(0);
            $table->decimal('average_review_rating', 3, 2)->default(0);
            $table->integer('cancelled_orders_count')->default(0);
            $table->timestamps();

            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('cascade');
            $table->foreign('favorite_category_id')->references('category_id')->on('categories')->onDelete('set null');
            $table->unique('customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_statistics');
    }
};