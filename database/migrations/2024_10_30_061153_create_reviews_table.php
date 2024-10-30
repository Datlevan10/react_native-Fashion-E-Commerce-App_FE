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
        Schema::create('reviews', function (Blueprint $table) {
            $table->string('review_id')->primary();
            $table->string('customer_id')->nullable();
            $table->string('product_id');
            $table->string('customer_name');
            $table->string('customer_email');
            $table->enum('customer_type', ['registered', 'guest'])->default('guest');
            $table->tinyInteger('stars_review')->unsigned();
            $table->string('review_title');
            $table->text('review_product');
            $table->json('media')->nullable();
            $table->enum('status', ['pending', 'approved', 'unpublished'])->default('pending');
            $table->timestamp('review_date')->useCurrent();
            $table->timestamps();

            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('cascade');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
