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
        Schema::create('shipping_rates', function (Blueprint $table) {
            $table->string('rate_id')->primary();
            $table->string('provider_id');
            $table->string('zone_id');
            $table->string('service_type'); // standard, express, same_day
            $table->decimal('base_rate', 10, 2);
            $table->decimal('rate_per_kg', 10, 2)->default(0);
            $table->decimal('free_shipping_threshold', 10, 2)->nullable(); // free shipping over this amount
            $table->integer('estimated_delivery_days');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('provider_id')->references('provider_id')->on('shipping_providers');
            $table->foreign('zone_id')->references('zone_id')->on('shipping_zones');
            $table->unique(['provider_id', 'zone_id', 'service_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_rates');
    }
};