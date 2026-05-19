<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function showProfile(User $user): JsonResponse
    {
        /** @var User $authenticatedUser */
        $authenticatedUser = Auth::user();

        if ($authenticatedUser->id === $user->id) {
            return response()->json(['message' => 'You cannot view your own profile through this route.'], 403);
        }

        if (!$authenticatedUser->isFriendsWith($user)) {
            return response()->json(['message' => 'You are not friends with this user.'], 403);
        }

        $gifts = $user->gifts()->latest()->get()->map(function ($gift) {
            return [
                'id' => $gift->id,
                'name' => $gift->name,
                'type' => $gift->type?->value,
                'price' => $gift->price,
                'quantity' => $gift->quantity,
                'description' => $gift->description,
                'color' => $gift->color,
            ];
        });

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'shirt_size' => $user->shirt_size,
                'shoe_size' => $user->shoe_size,
                'pants_size' => $user->pants_size,
                'ring_size' => $user->ring_size,
                'prefered_color' => $user->preferred_color,
            ],
            'wishlist' => $gifts,
        ]);
    }
}
