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
        Schema::create('staffs', function (Blueprint $table) {
            $table->string('staff_id')->primary();
            $table->string('user_name');
            $table->string('full_name');
            $table->string('gender')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('image')->nullable();
            $table->string('email')->unique();
            $table->string('phone_number')->unique();
            $table->string('password');
            $table->string('address');
            $table->date('hire_date')->nullable();
            $table->decimal('salary', 10, 2)->nullable();
            $table->string('department')->nullable();
            $table->string('role')->default('staff');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staffs');
    }
};
