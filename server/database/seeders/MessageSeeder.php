<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Message;
    
class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Message::factory()->count(10)->create(['parent_message_id' => null]);

        Message::factory()->count(40)->create();
    }
}
