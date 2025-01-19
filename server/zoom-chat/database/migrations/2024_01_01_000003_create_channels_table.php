<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('channels', function (Blueprint $table) {
            $table->bigIncrements('channel_id');
            $table->string('channel_name', 64)->nullable();
            $table->string('created_by', 32);
            $table->text('description')->nullable();
            $table->tinyInteger('channel_type')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('created_by')->references('op_id')->on('operators');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('channels');
    }
}; 