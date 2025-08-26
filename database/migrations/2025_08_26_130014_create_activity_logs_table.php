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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->string('log_id')->primary();
            $table->string('user_type'); // admin, staff, customer
            $table->string('user_id'); // actual ID based on user_type
            $table->string('user_name')->nullable();
            $table->string('action'); // created, updated, deleted, logged_in, etc.
            $table->string('resource_type'); // Order, Product, Customer, etc.
            $table->string('resource_id')->nullable();
            $table->text('description');
            $table->json('old_data')->nullable(); // before change
            $table->json('new_data')->nullable(); // after change
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('low');
            $table->timestamps();

            $table->index(['user_type', 'user_id']);
            $table->index(['action', 'created_at']);
            $table->index(['resource_type', 'resource_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};