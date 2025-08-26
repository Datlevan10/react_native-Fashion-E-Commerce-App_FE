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
        Schema::create('product_statistics', function (Blueprint $table) {
            $table->string('product_statistic_id')->primary();
            $table->string('product_id');
            $table->integer('total_sold_quantity')->default(0);
            $table->decimal('total_revenue', 15, 2)->default(0);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->integer('total_reviews_count')->default(0);
            $table->integer('view_count')->default(0);
            $table->integer('wishlist_count')->default(0);
            $table->timestamp('last_updated')->useCurrent();
            $table->timestamps();

            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
            $table->unique('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_statistics');
    }
};