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
        Schema::create('push_notifications', function (Blueprint $table) {
            $table->string('notification_id')->primary();
            $table->string('title');
            $table->text('body');
            $table->string('image')->nullable();
            $table->enum('type', ['promotion', 'order_update', 'new_product', 'flash_sale', 'general']);
            $table->json('data')->nullable(); // additional payload data
            $table->enum('target_audience', ['all_customers', 'specific_customers', 'customer_segments']);
            $table->json('target_customer_ids')->nullable(); // for specific customers
            $table->json('target_segments')->nullable(); // for customer segments
            $table->datetime('scheduled_at')->nullable();
            $table->enum('status', ['draft', 'scheduled', 'sent', 'failed'])->default('draft');
            $table->integer('sent_count')->default(0);
            $table->integer('delivered_count')->default(0);
            $table->integer('opened_count')->default(0);
            $table->integer('clicked_count')->default(0);
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
        Schema::dropIfExists('push_notifications');
    }
};