<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Módulo Gifts
    // Route::post('/gifts/create', [GiftController::class, 'create']);
    // Route::get('/gifts/user', [GiftController::class, 'userGifts']);

    // Módulo Amizades
    // Route::post('/friends/request', [FriendshipController::class, 'sendRequest']);
    // Route::get('/friends/requests', [FriendshipController::class, 'getRequests']);

    // Busca de usuários
    // Route::get('/users/search', [UserController::class, 'search']);

    // Nova rota para o TestController
    Route::get('/test', [TestController::class, 'index']);
});