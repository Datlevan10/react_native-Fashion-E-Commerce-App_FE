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
        Schema::table('admins', function (Blueprint $table) {
            $table->string('role_id')->nullable();
            $table->foreign('role_id')->references('role_id')->on('roles')->onDelete('set null');
        });

        Schema::table('staffs', function (Blueprint $table) {
            $table->string('role_id')->nullable();
            $table->json('permissions')->nullable(); // specific permissions override
            $table->foreign('role_id')->references('role_id')->on('roles')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });

        Schema::table('staffs', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn(['role_id', 'permissions']);
        });
    }
};