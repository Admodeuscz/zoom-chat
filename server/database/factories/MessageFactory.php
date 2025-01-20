<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Operator;
use App\Models\Message;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'sender_id' => Operator::factory(),
            'receiver_id' => $this->faker->boolean(70) ? Operator::factory() : null,
            'content' => $this->faker->sentence(),
            'parent_message_id' => $this->faker->boolean(50) ? $this->getParentMessageId() : null,
            'is_deleted' => $this->faker->boolean(5),
        ];
    }

    private function getParentMessageId()
    {
        $parentMessage = Message::whereNull('parent_message_id')->inRandomOrder()->first();

        return $parentMessage ? $parentMessage->message_id : null;
    }
}
