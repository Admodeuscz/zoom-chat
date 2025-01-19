<?php

namespace App\WebSocket;

use App\Events\NewMessageEvent;
use App\Models\Channel;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Laravel\Reverb\WebSockets\Handlers\WebSocketHandler;

class MessageWebSocketHandler extends WebSocketHandler
{
    public function onMessage($connection, $message)
    {
        $data = json_decode($message, true);
        $user = Auth::user();

        if (!$user) {
            $connection->send(json_encode([
                'error' => 'Unauthorized'
            ]));
            return;
        }

        // Validate message data
        if (!isset($data['channel_id']) || !isset($data['content']) || !isset($data['message_type'])) {
            $connection->send(json_encode([
                'error' => 'Invalid message format'
            ]));
            return;
        }

        // Check if user is member of channel
        $channel = Channel::find($data['channel_id']);
        if (!$channel || !$channel->members()->where('op_id', $user->op_id)->exists()) {
            $connection->send(json_encode([
                'error' => 'You are not a member of this channel'
            ]));
            return;
        }

        // Create new message
        $message = Message::create([
            'channel_id' => $data['channel_id'],
            'sender_id' => $user->op_id,
            'content' => $data['content'],
            'message_type' => $data['message_type'],
            'parent_message_id' => $data['parent_message_id'] ?? null
        ]);

        // Load relationships
        $message->load('sender');

        // Broadcast to other members
        broadcast(new NewMessageEvent($message))->toOthers();

        // Send confirmation to sender
        $connection->send(json_encode([
            'status' => 'success',
            'message' => $message
        ]));
    }
} 