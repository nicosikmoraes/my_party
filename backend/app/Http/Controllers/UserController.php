<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    private const DEFAULT_AVATAR_CUSTOMIZATION = [
        'skin_color' => '#F2C6A0',
        'hair_color' => '#2B1A10',
        'shirt_color' => '#E65C00',
        'pants_color' => '#333333',
        'shoes_color' => '#111111',
        'hair_style' => null,
        'shirt_model' => null,
        'pants_model' => null,
        'shoes_model' => null,
    ];

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

        $user->loadMissing('avatarCustomization');

        $avatarCustomization = $user->avatarCustomization
            ? [
                'skin_color' => $user->avatarCustomization->skin_color,
                'hair_color' => $user->avatarCustomization->hair_color,
                'shirt_color' => $user->avatarCustomization->shirt_color,
                'pants_color' => $user->avatarCustomization->pants_color,
                'shoes_color' => $user->avatarCustomization->shoes_color,
                'hair_style' => $user->avatarCustomization->hair_style,
                'shirt_model' => $user->avatarCustomization->shirt_model,
                'pants_model' => $user->avatarCustomization->pants_model,
                'shoes_model' => $user->avatarCustomization->shoes_model,
            ]
            : self::DEFAULT_AVATAR_CUSTOMIZATION;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'shirt_size' => $user->shirt_size,
                'shoe_size' => $user->shoe_size,
                'pants_size' => $user->pants_size,
                'ring_size' => $user->ring_size,
                'prefered_color' => $user->preferred_color,
                'avatar_url' => $user->avatar_url,
                'avatar_customization' => $avatarCustomization,
            ],
            'wishlist' => $gifts,
        ]);
    }
}
