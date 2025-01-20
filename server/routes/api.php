<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OperatorController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {
    Route::post('auth/register', 'register');
    Route::post('auth/login', 'login');
    Route::post('auth/refresh', 'refresh');
    Route::middleware('auth:api')->group(function () {
        Route::post('auth/logout', 'logout');
        Route::get('auth/me', 'me');
    });
});

Route::controller(MessageController::class)
->middleware('auth:api')
->group(function () {
    Route::get('messages', 'getMessages');
    Route::post('messages', 'sendMessage');
});

Route::controller(OperatorController::class)->group(function () {
    Route::get('operators', 'all');
});

