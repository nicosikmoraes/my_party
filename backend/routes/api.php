<?php
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventParticipantController;
use App\Http\Controllers\UserController;


Route::post('/register', [AuthController::class,'register']);
Route::post('/login', [AuthController::class,'login']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::post('/auth/google', [AuthController::class, 'googleLogin']);

Route::get('/gifts/type', [GiftController::class, 'types']);
Route::get('/colors', [GiftController::class, 'colors']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class,'logout']);

    Route::get('/user', function(Request $request){
        return $request->user();
    });

    Route::put('/user/update', [AuthController::class,'update']);

    Route::post('/gifts/create', [GiftController::class, 'store']);
    Route::get('/gifts', [GiftController::class, 'userGifts']);
    Route::patch('/gifts/{id}/purchase', [GiftController::class, 'markAsPurchased']);

    Route::post('/friends/send', [FriendshipController::class, 'send']);
    Route::get('/friends/requests', [FriendshipController::class, 'received']);
    Route::post('/friends/{friendship}/accept', [FriendshipController::class, 'accept']);
    Route::get('/users/search', [FriendshipController::class, 'search']);
    Route::get('/friends', [FriendshipController::class, 'friends']);
    Route::get('/users/{user}/profile', [UserController::class, 'showProfile']);

        Route::prefix('events')->group(function () {
        Route::get('/', [EventController::class, 'index']);
        Route::post('/', [EventController::class, 'store']);
        Route::get('/types', [EventController::class, 'types']);
        Route::get('/{event}', [EventController::class, 'show']);
        Route::put('/{event}', [EventController::class, 'update']);
        Route::delete('/{event}', [EventController::class, 'destroy']);

        Route::post('/{event}/invite', [EventParticipantController::class, 'invite']);
        Route::post('/{event}/accept', [EventParticipantController::class, 'accept']);
        Route::post('/{event}/decline', [EventParticipantController::class, 'decline']);
    });
});

Route::get('/test', function () {
    return response()->json(['ok' => true]);
});
