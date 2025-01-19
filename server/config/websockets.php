<?php

return [
    'handlers' => [
        'message' => App\WebSocket\MessageWebSocketHandler::class,
    ],

    'apps' => [
        [
            'id' => env('REVERB_APP_ID'),
            'name' => env('APP_NAME'),
            'key' => env('REVERB_APP_KEY'),
            'secret' => env('REVERB_APP_SECRET'),
            'path' => env('REVERB_PATH', '/reverb'),
            'capacity' => null,
            'enable_client_messages' => true,
            'enable_statistics' => true,
        ],
    ],

    'dashboard' => [
        'port' => env('REVERB_DASHBOARD_PORT', 6001),
        'path' => '/reverb-dashboard',
        'username' => env('REVERB_DASHBOARD_USERNAME'),
        'password' => env('REVERB_DASHBOARD_PASSWORD'),
    ],
]; 