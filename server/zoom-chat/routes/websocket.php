<?php

use App\WebSocket\MessageWebSocketHandler;
use Laravel\Reverb\Reverb;

Reverb::channel('channel.{channelId}', MessageWebSocketHandler::class); 