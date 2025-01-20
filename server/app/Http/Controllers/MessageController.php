<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Channel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Traits\HasApiResponses;
use Illuminate\Support\Facades\Validator;
use App\Events\GroupMessageSent;
use App\Events\UserMessageSent;

class MessageController extends Controller
{
    use HasApiResponses;

    public function __construct()
    {
    }

    function getMessages(Request $request) {
        $before = $request->input('before');
        $limit = $request->input('limit', 20);

        $query = Message::with(['sender', 'receiver'])
        ->where('parent_message_id', null)
        ->where('is_deleted', false)
        ->where(function ($query) {
            $query->where('receiver_id', null)
                ->orWhere('receiver_id', Auth::id())
                ->orWhere('sender_id', Auth::id());
        });
        
        if ($before) {
            $query->where('message_id', '<', $before);
        }
        
        $messages = $query
            ->limit($limit)
            ->get();

        foreach ($messages as $message) {
            $replies = Message::with(['sender', 'receiver'])
                ->where('parent_message_id', $message->message_id)
                ->where('is_deleted', false)
                ->where(function ($query) {
                    $query->where('receiver_id', null)
                        ->orWhere('receiver_id', Auth::id())
                        ->orWhere('sender_id', Auth::id());
                })
                ->get();

            $message->replies = $replies;
        }

        return $this->responseApi($messages, true, 200);
    }

    public function sendMessage(Request $request) {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:messages,message_id',
            'receiver_id' => 'nullable|exists:operators,op_id',
        ]);

        if ($validator->fails()) {
            return $this->responseApi($validator->errors(), false, 400);
        }

        $parentMessageId = $request->input('parent_id');
        if ($parentMessageId) {
            $parentMessage = Message::find($parentMessageId);
            if ($parentMessage->parent_message_id) {
                $parentMessageId = $parentMessage->parent_message_id;
            }
        }

        $message = Message::create([
            'sender_id' => Auth::id(),
            'content' => $request->input('content'),
            'parent_message_id' => $parentMessageId,
            'receiver_id' => $request->input('receiver_id'),
        ]);

        if ($message->receiver_id) {
            broadcast(new UserMessageSent($message))->toOthers();
        } else {
            broadcast(new GroupMessageSent($message))->toOthers();
        }

        $message->load('sender', 'receiver', 'parentMessage.sender');

        return $this->responseApi($message, true, 200);
    }
}

