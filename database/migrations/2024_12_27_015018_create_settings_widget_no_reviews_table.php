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
            $table->string('no_review_title');
            $table->string('no_review_subtitle');
            $table->string('button_text');
            $table->string('widget_no_review_background_color');
            $table->string('no_review_title_color');
            $table->string('no_review_subtitle_color');
            $table->string('button_background_color');
            $table->string('button_text_color');
            $table->string('widget_no_review_border_color');
            $table->timestamps();

            $table->foreign('admin_id')->references('admin_id')->on('admins')->onDelete('cascade');
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
