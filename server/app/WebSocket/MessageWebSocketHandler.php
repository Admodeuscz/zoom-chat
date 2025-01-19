<?php

namespace App\WebSocket;

use App\Events\MessageEvent;
use App\Models\Channel;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Laravel\Reverb\WebSockets\Handlers\WebSocketHandler;

class MessageWebSocketHandler extends WebSocketHandler
{
    protected function onConnect($connection)
    {
        $token = $connection->httpRequest->headers->get('Authorization');
        if (!$token || !Auth::guard('api')->check()) {
            $connection->send(json_encode([
                'error' => 'Unauthorized'
            ]));
            $connection->close();
            return;
        }
    }

    protected function onMessage($connection, $message)
    {
        $data = json_decode($message, true);
        $user = Auth::guard('api')->user();

        if (!isset($data['channel_id']) || !isset($data['content']) || !isset($data['message_type'])) {
            $connection->send(json_encode([
                'error' => 'Invalid message format'
            ]));
            return;
        }

        $channel = Channel::find($data['channel_id']);
        if (!$channel || !$channel->members()->where('op_id', $user->op_id)->exists()) {
            $connection->send(json_encode([
                'error' => 'You are not a member of this channel'
            ]));
            return;
        }

        $message = Message::create([
            'channel_id' => $data['channel_id'],
            'sender_id' => $user->op_id,
            'content' => $data['content'],
            'message_type' => $data['message_type'],
            'parent_message_id' => $data['parent_message_id'] ?? null
        ]);

        $message->load('sender');

        broadcast(new MessageEvent($message))->toOthers();

        $connection->send(json_encode([ 
            'status' => 'success',
            'message' => $message
        ]));
    }
} 