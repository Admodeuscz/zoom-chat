<?php

namespace App\Http\Controllers;

use App\Enums\MessageUpdateEnum;
use App\Events\GroupMessageSent;
use App\Events\NewMessageEvent;
use App\Events\UpdateMessageEvent;
use App\Events\UserMessageSent;
use App\Models\Message;
use App\Traits\HasApiResponses;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    use HasApiResponses;

    function getMessages(Request $request)
    {
        $requestedDate = $request->input('date');
        $date = $requestedDate ? Carbon::parse($requestedDate)->startOfDay() : Carbon::today();

        $query = Message::with(['sender.team', 'receiver.team'])
            ->where('parent_message_id', null)
            ->where('is_deleted', false)
            ->whereDate('created_at', $date)
            ->where(function ($query) {
                $query->where('receiver_id', null)
                    ->orWhere('receiver_id', Auth::id())
                    ->orWhere('sender_id', Auth::id());
            });

        $messages = $query->get();

        $messageIds = $messages->pluck('message_id');
        $replies = Message::with(['sender.team', 'receiver.team'])
            ->whereIn('parent_message_id', $messageIds)
            ->where('is_deleted', false)
            ->get()
            ->groupBy('parent_message_id');

        foreach ($messages as $message) {
            $message->replies = $replies[$message->message_id] ?? collect();
        }

        $previousDayMessage = Message::select('created_at')
            ->where('is_deleted', false)
            ->where(function ($query) {
                $query->where('receiver_id', null)
                    ->orWhere('receiver_id', Auth::id())
                    ->orWhere('sender_id', Auth::id());
            })
            ->whereDate('created_at', '<', $date)
            ->first();

        $previousDay = $previousDayMessage ? $previousDayMessage->created_at->toDateString() : null;

        $dateMessage = new Message([
            'content' => $date,
            'type' => 'date',
        ]);

        $messages->prepend($dateMessage);

        return $this->responseApi([
            'messages' => $messages,
            'previousDay' => $previousDay,
        ], true, 200);
    }

    public function sendMessage(Request $request)
    {
        try {
            DB::beginTransaction();

            $data = $request->validate([
                'content' => 'required|string|max:5000',
                'parent_id' => 'nullable|exists:messages,message_id',
                'receiver_id' => 'nullable|exists:operators,op_id',
            ]);

            if (!empty($data['parent_id'])) {
                $parentMessage = Message::select('message_id', 'parent_message_id', 'sender_id', 'receiver_id')
                    ->find($data['parent_id']);

                if ($parentMessage) {
                    $data['parent_id'] = $parentMessage->parent_message_id ?? $data['parent_id'];

                    if ($parentMessage->receiver_id) {
                        $data['receiver_id'] = $parentMessage->sender_id === Auth::id()
                            ? $parentMessage->receiver_id
                            : $parentMessage->sender_id;
                    }
                }
            }

            $message = Message::create([
                'sender_id' => Auth::id(),
                'content' => $data['content'],
                'parent_message_id' => $data['parent_id'] ?? null,
                'receiver_id' => $data['receiver_id'] ?? null,
                'reactions' => json_encode([]),
            ]);

            $message->load(['sender.team', 'receiver.team', 'parentMessage.sender.team']);

            broadcast(new NewMessageEvent($message))->toOthers();

            DB::commit();

            return $this->responseApi([], true, 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseApi(['error' => $e->getMessage()], false, 500);
        }
    }

    public function updateReactionMessage(Request $request, $messageId)
    {
        DB::beginTransaction();

        try {
            $message = Message::find($messageId);

            if (!$message) {
                return $this->responseApi(['error' => 'Message not found'], false, 404);
            }

            $validator = Validator::make($request->all(), [
                'emoji_id' => 'required|string',
                'icon' => 'required|string',
            ]);

            if ($validator->fails()) {
                return $this->responseApi(['error' => $validator->errors()], false, 422);
            }

            $emojiId = $request->input('emoji_id');
            $icon = $request->input('icon');

            $reactions = json_decode($message->reactions, true) ?: [];

            $index = array_search($emojiId, array_column($reactions, 'emoji_id'));
            if ($index === false) {
                $reactions[] = [
                    'senders' => [],
                    'emoji_id' => $emojiId,
                    'icon' => $icon,
                ];
                $index = count($reactions) - 1;
            }

            $opIdIndex = array_search(Auth::id(), array_column($reactions[$index]['senders'], 'op_id'));
            if ($opIdIndex !== false) {
                unset($reactions[$index]['senders'][$opIdIndex]);
            } else {
                $reactions[$index]['senders'][] = [
                    'op_id' => Auth::id(),
                    'op_name' => Auth::user()->op_name,
                ];
            }

            if (count($reactions[$index]['senders']) == 0) {
                unset($reactions[$index]);
            }

            $message->reactions = json_encode(array_values($reactions));
            $message->save();

            DB::commit();

            broadcast(new UpdateMessageEvent($message, MessageUpdateEnum::REACTIONS))->toOthers();

            return $this->responseApi($message, true, 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseApi($e->getMessage(), false, 500);
        }
    }

    function updateContentMessage(Request $request, $messageId)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return $this->responseApi(['error' => $validator->errors()], false, 422);
        }

        $message = Message::find($messageId);

        if (!$message) {
            return $this->responseApi(['error' => 'Message not found'], false, 404);
        }

        if ($message->sender_id !== Auth::id()) {
            return $this->responseApi(['error' => 'You are not allowed to update this message'], false, 403);
        }

        $message->content = $request->input('content');
        $message->save();

        broadcast(new UpdateMessageEvent($message, MessageUpdateEnum::CONTENT))->toOthers();

        return $this->responseApi([], true, 200);
    }
}

