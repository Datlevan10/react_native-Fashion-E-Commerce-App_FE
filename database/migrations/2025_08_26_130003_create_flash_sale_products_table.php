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
        Schema::create('flash_sale_products', function (Blueprint $table) {
            $table->string('flash_sale_product_id')->primary();
            $table->string('flash_sale_id');
            $table->string('product_id');
            $table->decimal('original_price', 10, 2);
            $table->decimal('sale_price', 10, 2);
            $table->decimal('discount_percentage', 5, 2);
            $table->integer('stock_limit')->nullable(); // limited quantity for flash sale
            $table->integer('sold_quantity')->default(0);
            $table->timestamps();

            $table->foreign('flash_sale_id')->references('flash_sale_id')->on('flash_sales')->onDelete('cascade');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
            $table->unique(['flash_sale_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flash_sale_products');
    }
};