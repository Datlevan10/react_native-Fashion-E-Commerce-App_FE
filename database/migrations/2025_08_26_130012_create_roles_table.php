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
        Schema::create('roles', function (Blueprint $table) {
            $table->string('role_id')->primary();
            $table->string('name')->unique(); // Super Admin, Admin, Sales Manager, Sales Staff, Warehouse Staff
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->json('permissions'); // array of permission codes
            $table->boolean('is_active')->default(true);
            $table->boolean('is_system_role')->default(false); // system roles cannot be deleted
            $table->string('created_by')->nullable(); // admin_id
            $table->timestamps();

            $table->foreign('created_by')->references('admin_id')->on('admins')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};