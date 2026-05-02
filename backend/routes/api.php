<?php
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\FriendshipController;


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
    Route::get('/users/search', [FriendshipController::class, 'search']);
});

Route::get('/test', function () {
    return response()->json(['ok' => true]);
});