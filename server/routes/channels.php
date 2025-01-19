<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('channel.{channelId}', function ($user, $channelId) {
    return $user->channels()
        ->where('channel_id', $channelId)
        ->exists();
});
