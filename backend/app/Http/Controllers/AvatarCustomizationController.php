<?php

namespace App\Http\Controllers;

use App\Models\AvatarCustomization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AvatarCustomizationController extends Controller
{
    private const DEFAULT_CUSTOMIZATION = [
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

    public function show()
    {
        $user = Auth::user();
        $customization = $user->avatarCustomization;

        if (!$customization) {
            return response()->json(self::DEFAULT_CUSTOMIZATION);
        }

        return response()->json($customization);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'skin_color' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'hair_color' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'shirt_color' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'pants_color' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'shoes_color' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'hair_style' => ['nullable', 'string', 'max:255'],
            'shirt_model' => ['nullable', 'string', 'max:255'],
            'pants_model' => ['nullable', 'string', 'max:255'],
            'shoes_model' => ['nullable', 'string', 'max:255'],
        ]);

        $customization = AvatarCustomization::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return response()->json($customization);
    }
}