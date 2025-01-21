<?php

namespace App\Http\Controllers;

use App\Events\GroupMessageSent;
use App\Events\UserMessageSent;
use App\Models\Message;
use App\Traits\HasApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    use HasApiResponses;

    function getMessages(Request $request) {
        $before = $request->input('before');
        $limit = $request->input('limit', 20);
        
        $cacheKey = "messages:{$before}:{$limit}:" . Auth::id();
        
        return Cache::remember($cacheKey, 60, function() use ($before, $limit) {
            $query = Message::with(['sender.team', 'receiver.team'])
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

            $messages = $query->orderBy('message_id', 'desc')
                ->limit($limit)
                ->get();

            $messageIds = $messages->pluck('message_id');
            $replies = Message::with(['sender.team', 'receiver.team'])
                ->whereIn('parent_message_id', $messageIds)
                ->where('is_deleted', false)
                ->get()
                ->groupBy('parent_message_id');

            foreach ($messages as $message) {
                $message->replies = $replies[$message->message_id] ?? collect();
            }

            return $this->responseApi($messages, true, 200);
        });
    }

    public function sendMessage(Request $request) {
        try {
            DB::beginTransaction();
            
            $data = $request->validate([
                'content' => 'required|string',
                'parent_id' => 'nullable|exists:messages,message_id',
                'receiver_id' => 'nullable|exists:operators,op_id',
            ]);

            if (!empty($data['parent_id'])) {
                $parentMessage = Message::select('message_id', 'parent_message_id')
                    ->find($data['parent_id']);
                    
                if ($parentMessage && $parentMessage->parent_message_id) {
                    $data['parent_id'] = $parentMessage->parent_message_id;
                }
            }

            $message = Message::create([
                'sender_id' => Auth::id(),
                'content' => $data['content'],
                'parent_message_id' => $data['parent_id'] ?? null,
                'receiver_id' => $data['receiver_id'] ?? null,
            ]);

            $message->load(['sender.team', 'receiver.team', 'parentMessage.sender.team']);

            if ($message->receiver_id) {
                broadcast(new UserMessageSent($message))->toOthers();
            } else {
                broadcast(new GroupMessageSent($message))->toOthers();
            }

            DB::commit();

            Cache::tags(['messages'])->flush();

            return $this->responseApi([], true, 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseApi(['error' => $e->getMessage()], false, 500);
        }
    }
}

