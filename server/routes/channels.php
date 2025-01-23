<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('user-chat.{userId}', function ($user, $userId) {
    return (int)$user->op_id === (int)$userId;
});

Broadcast::channel('group-chat', function ($user) {
    return $user->load('team');
});
