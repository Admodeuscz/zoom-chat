<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('operators', function (Blueprint $table) {
            $table->string('op_id', 32)->primary();
            $table->string('op_name', 64);
            $table->string('op_name_kana', 64)->nullable();
            $table->string('pwd', 255);
            $table->unsignedBigInteger('team_id')->nullable();
            $table->timestamp('regist_date')->useCurrent();
            $table->timestamp('update_date')->useCurrent();

            $table->foreign('team_id')->references('team_id')->on('teams');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('operators');
    }
}; 