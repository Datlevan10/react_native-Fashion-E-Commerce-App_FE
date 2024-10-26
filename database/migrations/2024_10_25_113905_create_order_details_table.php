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
        Schema::create('order_details', function (Blueprint $table) {
            $table->string('order_detail_id')->primary();
            $table->string('order_id');
            $table->string('product_id');
            $table->string('product_name');
            $table->integer('quantity');
            $table->string('color');
            $table->string('size');
            $table->string('image');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);
            $table->timestamps();

            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
