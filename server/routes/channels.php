<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('group-chat', function ($user) {
    return true;
});

Broadcast::channel('user-chat.{userId}', function ($user, $userId) {
    return $user->id === $userId;
});
