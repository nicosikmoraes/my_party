<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gift;
use App\Enums\GiftType;
use App\Enums\Color;
use Illuminate\Validation\Rule;

class GiftController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'nullable|numeric',
            'quantity' => 'nullable|integer',
            'description' => 'nullable|string',
            'color' => ['nullable', Rule::in(array_column(Color::cases(), 'value'))],
            'size' => 'nullable|string',
            'type' => ['required', Rule::in(array_map(fn($t) => $t->value, GiftType::cases()))],
        ]);

        $gift = Gift::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($gift, 201);
    }

    public function types()
    {
        return collect(GiftType::cases())->map(fn($type) => [
            'label' => $type->label(),
            'value' => $type->value,
        ]);
    }

    public function colors()
    {
        return response()->json(
            collect(Color::cases())->map(fn($color) => [
                'label' => $color->label(),
                'value' => $color->value,
            ])
        );
    }

    public function userGifts(Request $request)
    {
        return response()->json(
            $request->user()->gifts()->latest()->get()
        );
    }
    public function markAsPurchased($id, Request $request)
    {
        $gift = Gift::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $gift->is_purchased = true;
        $gift->save();

        return response()->json($gift);
    }
    }