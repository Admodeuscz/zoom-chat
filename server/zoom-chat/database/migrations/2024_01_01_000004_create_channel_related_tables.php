<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('channel_members', function (Blueprint $table) {
            $table->unsignedBigInteger('channel_id');
            $table->string('op_id', 32);
            $table->string('background_color', 7);
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamp('left_at')->nullable();
            $table->boolean('is_active')->default(true);

            $table->primary(['channel_id', 'op_id']);
            $table->foreign('channel_id')->references('channel_id')->on('channels');
            $table->foreign('op_id')->references('op_id')->on('operators');
        });

        Schema::create('channel_colors', function (Blueprint $table) {
            $table->unsignedBigInteger('channel_id');
            $table->string('color_code', 7);
            $table->integer('use_count')->default(0);

            $table->primary(['channel_id', 'color_code']);
            $table->foreign('channel_id')->references('channel_id')->on('channels');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('channel_members');
        Schema::dropIfExists('channel_colors');
    }
}; 