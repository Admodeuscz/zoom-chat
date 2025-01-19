<?php

namespace App\Http\Controllers;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    function getMessages($channel_id, Request $request) {
        $before = $request->input('before');
        $limit = $request->input('limit', 20);

        $query = Message::with('sender')
        ->where('channel_id', $channel_id)
        ->where('parent_message_id', null);

        if ($before) {
            $query->where('message_id', '<', $before);
        }

        $messages = $query
                          ->orderBy('message_id', 'desc')
                          ->limit($limit)
                          ->get();
        return $this->responseApi($messages, true, 200);
    }

    function getSubMessages($message_id) {
        $messages = Message::with('sender')
        ->where('parent_message_id', $message_id)
        ->get();
        return $this->responseApi($messages, true, 200);
    }
}

