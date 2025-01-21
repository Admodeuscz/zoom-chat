<?php

namespace App\Listeners;

use App\Events\GroupMessageSent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\NewMessageEvent;

class BroadcastMessage
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(NewMessageEvent $event): void
    {
        $message = json_decode($event->message, true);
        broadcast(new GroupMessageSent($message))->toOthers();
    }
}
