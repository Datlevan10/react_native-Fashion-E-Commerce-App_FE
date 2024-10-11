<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::dropIfExists('products');

        Schema::create('products', function (Blueprint $table) {
            $table->string('productId')->primary();
            $table->string('categoryId');
            $table->string('productName');
            $table->text('description');
            $table->json('color');
            $table->json('size');
            $table->json('image');
            $table->decimal('oldPrice', 10, 2)->nullable();
            $table->decimal('newPrice', 10, 2)->nullable();
            $table->integer('totalReview')->default(0);
            $table->integer('averageReview')->default(0);
            $table->timestamps();

            $table->foreign('categoryId')->references('categoryId')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
