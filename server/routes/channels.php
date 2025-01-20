<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('channel.group', function ($user) {
    return $user !== null;
});

Broadcast::channel('channel.user.{userId}', function ($user, $userId) {
    return $user->id === $userId;
});
