<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Channel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Traits\HasApiResponses;

class MessageController extends Controller
{
    use HasApiResponses;

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    function getMessages($channel_id, Request $request) {
        $channel = Channel::findOrFail($channel_id);
        if (!$channel->members()->where('op_id', Auth::id())->exists()) {
            return $this->responseApi(null, false, 403, 'Không có quyền truy cập channel này');
        }

        $before = $request->input('before');
        $limit = $request->input('limit', 20);

        $query = Message::with(['sender', 'replies.sender'])
            ->where('channel_id', $channel_id)
            ->where('parent_message_id', null)
            ->where('is_deleted', false);

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
        $message = Message::findOrFail($message_id);
        
        if (!$message->channel->members()->where('op_id', Auth::id())->exists()) {
            return $this->responseApi(null, false, 403, 'Không có quyền truy cập tin nhắn này');
        }

        $messages = Message::with('sender')
            ->where('parent_message_id', $message_id)
            ->where('is_deleted', false)
            ->orderBy('created_at', 'asc')
            ->get();

        return $this->responseApi($messages, true, 200);
    }

    public function deleteMessage($message_id)
    {
        $message = Message::findOrFail($message_id);
        
        if ($message->sender_id !== Auth::id()) {
            return $this->responseApi(null, false, 403, 'Bạn không có quyền xóa tin nhắn này');
        }

        $message->update(['is_deleted' => true]);

        broadcast(new MessageEvent($message))->toOthers();

        return $this->responseApi(null, true, 200, 'Tin nhắn đã được xóa');
    }
}

