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
        Schema::create('loyalty_point_transactions', function (Blueprint $table) {
            $table->string('transaction_id')->primary();
            $table->string('customer_id');
            $table->string('order_id')->nullable(); // if related to order
            $table->enum('type', ['earned', 'redeemed', 'expired', 'adjustment']);
            $table->integer('points');
            $table->string('description');
            $table->json('metadata')->nullable(); // additional data about the transaction
            $table->date('expires_at')->nullable(); // when earned points expire
            $table->timestamps();

            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('cascade');
            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loyalty_point_transactions');
    }
};