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
    Schema::create('report_reviews', function (Blueprint $table) {
        $table->string('report_id')->primary();
        $table->string('review_id');
        $table->string('reporter_id');
        $table->enum('reporter_type', ['customer', 'admin', 'staff', 'guest'])->default('guest');
        $table->string('report_reason');
        $table->enum('status', ['pending', 'reviewed', 'resolved', 'dismissed'])->default('pending');
        $table->timestamp('reported_at')->useCurrent();
        $table->timestamps();

        $table->foreign('review_id')->references('review_id')->on('reviews')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_reviews');
    }
};
