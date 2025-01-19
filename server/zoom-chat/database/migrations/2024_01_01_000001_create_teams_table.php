<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id('team_id');
            $table->string('team_name', 64);
            $table->string('memo', 128)->nullable();
            $table->timestamp('regist_date')->useCurrent();
            $table->timestamp('update_date')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
}; 