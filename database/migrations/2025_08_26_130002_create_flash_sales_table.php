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
        Schema::create('flash_sales', function (Blueprint $table) {
            $table->string('flash_sale_id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('banner_image')->nullable();
            $table->datetime('starts_at');
            $table->datetime('ends_at');
            $table->boolean('is_active')->default(true);
            $table->integer('max_products_per_customer')->nullable();
            $table->string('created_by'); // admin_id
            $table->timestamps();

            $table->foreign('created_by')->references('admin_id')->on('admins');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flash_sales');
    }
};