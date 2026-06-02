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
        Schema::create('avatar_customizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('skin_color')->nullable();
            $table->string('hair_color')->nullable();
            $table->string('shirt_color')->nullable();
            $table->string('pants_color')->nullable();
            $table->string('shoes_color')->nullable();
            $table->string('hair_style')->nullable();
            $table->string('shirt_model')->nullable();
            $table->string('pants_model')->nullable();
            $table->string('shoes_model')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avatar_customizations');
    }
};