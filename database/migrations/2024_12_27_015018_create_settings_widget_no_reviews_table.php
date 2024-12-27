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
        Schema::create('settings_widget_no_reviews', function (Blueprint $table) {
            $table->string('no_review_id')->primary();
            $table->string('admin_id');
            $table->string('store_id')->nullable();
            $table->string('no_review_title_text');
            $table->string('no_review_subtitle_text');
            $table->string('button_text');
            $table->string('widget_no_review_background_color', 7);
            $table->string('no_review_title_text_color', 7);
            $table->string('no_review_subtitle_text_color', 7);
            $table->string('button_background_color', 7);
            $table->string('button_text_color', 7);
            $table->string('widget_no_review_border_color', 7);
            $table->timestamps();

            $table->foreign('admin_id')->references('admin_id')->on('admins')->onDelete('cascade');
            $table->foreign('store_id')->references('store_id')->on('stores')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings_widget_no_reviews');
    }
};
