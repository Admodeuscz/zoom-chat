<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:api')->group(function () {
    // Message routes
    Route::get('/channels/{channel_id}/messages', [MessageController::class, 'getMessages']);
    Route::get('/messages/{message_id}/replies', [MessageController::class, 'getSubMessages']);
    Route::delete('/messages/{message_id}', [MessageController::class, 'deleteMessage']);
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_middleware'),
    'verified'
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
}); 