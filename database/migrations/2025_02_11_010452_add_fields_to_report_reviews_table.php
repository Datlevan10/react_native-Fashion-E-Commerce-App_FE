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
        Schema::table('report_reviews', function (Blueprint $table) {
            $table->string('handled_by')->nullable();
            $table->timestamp('handled_at')->nullable() ;
            $table->string('reply')->nullable();
            $table->timestamp('reply_at')->nullable() ;

            $table->foreign('handled_by')->references('admin_id')->on('admins')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('report_reviews', function (Blueprint $table) {
            //
        });
    }
};
