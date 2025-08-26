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
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->string('payment_method_id')->primary();
            $table->string('name'); // Cash on Delivery, MoMo, VNPay, Stripe
            $table->string('code')->unique(); // cod, momo, vnpay, stripe
            $table->string('type'); // digital_wallet, bank_transfer, cash_on_delivery, credit_card
            $table->string('logo')->nullable();
            $table->boolean('is_active')->default(true);
            $table->decimal('transaction_fee_percentage', 5, 2)->default(0);
            $table->decimal('transaction_fee_fixed', 10, 2)->default(0);
            $table->decimal('minimum_amount', 10, 2)->default(0);
            $table->decimal('maximum_amount', 10, 2)->nullable();
            $table->json('api_config')->nullable(); // API keys, merchant IDs, etc.
            $table->json('supported_currencies')->nullable(); // VND, USD, etc.
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};