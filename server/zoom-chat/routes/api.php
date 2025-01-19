<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {
    Route::post('auth/register', 'register');
    Route::post('auth/login', 'login');
    Route::middleware('auth:api')->group(function () {
        Route::post('auth/logout', 'logout');
        Route::post('auth/refresh', 'refresh');
        Route::get('auth/me', 'me');
    });
});