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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('shirt_size', ['PP', 'P', 'M', 'G', 'GG'])->nullable();
            $table->integer('shoe_size')->nullable();
            $table->integer('pants_size')->nullable();
            $table->integer('ring_size')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['shirt_size', 'shoe_size', 'pants_size', 'ring_size']);
        });
    }
};
