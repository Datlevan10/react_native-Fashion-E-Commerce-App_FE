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
        Schema::create('customer_loyalty_points', function (Blueprint $table) {
            $table->string('loyalty_point_id')->primary();
            $table->string('customer_id');
            $table->integer('current_points')->default(0);
            $table->integer('lifetime_points')->default(0); // total points earned ever
            $table->integer('points_used')->default(0);
            $table->enum('membership_tier', ['bronze', 'silver', 'gold', 'platinum', 'diamond'])->default('bronze');
            $table->date('tier_achieved_date')->nullable();
            $table->date('tier_expires_date')->nullable();
            $table->timestamps();

            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('cascade');
            $table->unique('customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_loyalty_points');
    }
};