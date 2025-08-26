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
        Schema::create('shipping_providers', function (Blueprint $table) {
            $table->string('provider_id')->primary();
            $table->string('name'); // GHN, GHTK, ViettelPost, etc.
            $table->string('code')->unique(); // ghn, ghtk, viettel_post
            $table->string('logo')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('api_config')->nullable(); // API keys, endpoints, etc.
            $table->json('supported_services')->nullable(); // express, standard, etc.
            $table->decimal('base_fee', 10, 2)->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_providers');
    }
};