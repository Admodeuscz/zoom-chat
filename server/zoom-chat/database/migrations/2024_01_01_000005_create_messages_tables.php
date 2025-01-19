<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->bigIncrements('message_id');
            $table->unsignedBigInteger('channel_id');
            $table->string('sender_id', 32);
            $table->text('content');
            $table->string('message_type', 20);
            $table->unsignedBigInteger('parent_message_id')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->boolean('is_deleted')->default(false);

            $table->foreign('channel_id')->references('channel_id')->on('channels');
            $table->foreign('sender_id')->references('op_id')->on('operators');
            $table->foreign('parent_message_id')->references('message_id')->on('messages');
        });

        Schema::create('message_reads', function (Blueprint $table) {
            $table->unsignedBigInteger('message_id');
            $table->string('op_id', 32);
            $table->timestamp('read_at')->useCurrent();

            $table->primary(['message_id', 'op_id']);
            $table->foreign('message_id')->references('message_id')->on('messages');
            $table->foreign('op_id')->references('op_id')->on('operators');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_reads');
        Schema::dropIfExists('messages');
    }
}; 