<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\UserController;

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

// Existing routes (example placeholders, do not modify or remove)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    // Existing authenticated routes (example placeholders, do not modify or remove)
    // Gifts
    Route::post('/gifts/create', [GiftController::class, 'store']);
    Route::get('/gifts/user', [GiftController::class, 'index']);

    // Friends
    Route::post('/friends/request', [FriendController::class, 'sendRequest']);
    Route::get('/friends/requests', [FriendController::class, 'getRequests']);
    Route::get('/users/search', [UserController::class, 'search']);

    // ADD NEW ROUTE FOR TEST CONTROLLER
    Route::get('/test/reversed-name', [TestController::class, 'getReversedUserName']);
});