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
        Schema::create('products', function (Blueprint $table) {
            $table->string('productId')->primary();
            $table->string('categoryId');
            $table->string('productName');
            $table->text('description');
            $table->json('color');
            $table->json('size');
            $table->json('image');
            $table->integer('ratingCount')->default(0);
            $table->float('ratingAverage')->default(0);
            $table->timestamps();
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
