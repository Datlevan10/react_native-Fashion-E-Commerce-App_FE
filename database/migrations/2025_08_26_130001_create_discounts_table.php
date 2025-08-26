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
        Schema::create('discounts', function (Blueprint $table) {
            $table->string('discount_id')->primary();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['percentage', 'fixed_amount', 'buy_x_get_y', 'free_shipping']);
            $table->decimal('value', 10, 2); // percentage or fixed amount
            $table->decimal('minimum_order_amount', 10, 2)->nullable();
            $table->decimal('maximum_discount_amount', 10, 2)->nullable();
            $table->integer('usage_limit')->nullable(); // total usage limit
            $table->integer('usage_limit_per_customer')->nullable();
            $table->integer('used_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->datetime('starts_at');
            $table->datetime('expires_at');
            $table->json('applicable_products')->nullable(); // product IDs
            $table->json('applicable_categories')->nullable(); // category IDs
            $table->enum('customer_eligibility', ['all', 'new_customers', 'returning_customers', 'vip_members'])->default('all');
            $table->string('created_by'); // admin_id
            $table->timestamps();

            $table->foreign('created_by')->references('admin_id')->on('admins');
            $table->index(['code', 'is_active']);
            $table->index(['starts_at', 'expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};