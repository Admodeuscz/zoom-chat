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
        Schema::dropIfExists('message_reads');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('message_reads', function (Blueprint $table) {
            $table->unsignedBigInteger('message_id');
            $table->string('op_id', 32);
            $table->timestamp('read_at')->useCurrent();

            $table->primary(['message_id', 'op_id']);
            $table->foreign('message_id')->references('message_id')->on('messages');
            $table->foreign('op_id')->references('op_id')->on('operators');
        });
    }
};
