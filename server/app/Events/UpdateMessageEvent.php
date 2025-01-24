<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use App\Enums\MessageUpdateEnum;

class UpdateMessageEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public MessageUpdateEnum $type;

    public function __construct($message, MessageUpdateEnum $type)
    {
        $this->message = $message;
        $this->type = $type;
    }

    public function broadcastOn()
    {
        if ($this->message->receiver_id) {
            // gửi riêng cho cả người nhận và người gửi

            return [
                new PrivateChannel('user-chat.' . $this->message->receiver_id),
                new PrivateChannel('user-chat.' . $this->message->sender_id),
            ];
        }

        return new PresenceChannel('group-chat');
    }

    public function broadcastWith()
    {
        return [
            'type' => $this->type->value,
            'message' => $this->message,
        ];
    }
}

