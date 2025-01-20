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
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn('message_type');
            $table->string('receiver_id', 32)->nullable();
            $table->foreign('receiver_id')->references('op_id')->on('operators');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['receiver_id']);
            $table->dropColumn('receiver_id');
            $table->string('message_type', 20)->nullable();
        });
    }
};
