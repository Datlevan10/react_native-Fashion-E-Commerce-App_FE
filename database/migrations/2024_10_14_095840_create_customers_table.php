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
        Schema::create('customers', function (Blueprint $table) {
            $table->string('customerId')->primary();
            $table->string('userName');
            $table->string('fullName');
            $table->string('gender')->nullable();
            $table->string('dateOfBirth')->nullable();
            $table->string('image')->nullable();
            $table->string('email')->unique();
            $table->string('phoneNumber')->unique();
            $table->string('passWord');
            $table->string('address');
            $table->string('role')->default('customer');
            $table->boolean('isActive')->default(true);
            $table->timestamp('lastLogin')->nullable();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
