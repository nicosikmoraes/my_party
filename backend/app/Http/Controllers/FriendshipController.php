<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use Illuminate\Http\Request;
use App\Models\User;

class FriendshipController extends Controller
{
    public function send(Request $request)
{
    $request->validate([
        'receiver_id' => 'required|exists:users,id',
    ]);

    $user = $request->user();
    $receiverId = $request->receiver_id;

    if ($user->id == $receiverId) {
        return response()->json([
            'message' => 'You cannot send a friend request to yourself'
        ], 400);
    }

    $existing = Friendship::where(function ($query) use ($user, $receiverId) {
        $query->where('sender_id', $user->id)
              ->where('receiver_id', $receiverId);
    })->orWhere(function ($query) use ($user, $receiverId) {
        $query->where('sender_id', $receiverId)
              ->where('receiver_id', $user->id);
    })->first();

    if ($existing && $existing->status !== 'rejected'){
        return response()->json([
            'message' => 'Friend request already exists or you are already friends'
        ], 400);
    }

    $friendship = Friendship::create([
        'sender_id' => $user->id,
        'receiver_id' => $receiverId,
        'status' => 'pending',
    ]);

    return response()->json([
        'message' => 'Friend request sent',
        'data' => $friendship
    ], 201);
}

    public function received(Request $request)
{
    $user = $request->user();

    $requests = Friendship::with('sender:id,name,email')
        ->where('receiver_id', $user->id)
        ->where('status', 'pending')
        ->latest()
        ->get();

    return response()->json($requests);
}

    public function search(Request $request)
{
    $request->validate([
        'name' => 'required|string'
    ]);

    $user = $request->user();

    $users = User::whereRaw('LOWER(name) = ?', [strtolower($request->name)])
        ->where('id', '!=', $user->id)
        ->get(['id', 'name']);

    return response()->json($users);
}

public function accept(Request $request, Friendship $friendship)
{
$user = $request->user();

    if ($friendship->receiver_id !== $user->id) {
        return response()->json(['message' => 'You are not authorized to accept this friendship request.'], 403);
    }

    if ($friendship->status !== 'pending') {
        return response()->json(['message' => 'This friendship request is not pending.'], 400);
    }

    $friendship->status = 'accepted';
    $friendship->save();

    return response()->json([
        'message' => 'Friendship request accepted successfully.',
        'friendship' => $friendship
    ], 200);

}

public function friends(Request $request)
{
    $user = $request->user();

    $friendships = Friendship::where('status', 'accepted')
        ->where(function ($query) use ($user) {
            $query->where('sender_id', $user->id)
                ->orWhere('receiver_id', $user->id);
        })
        ->with([
            'sender:id,name,email,preferred_color',
            'receiver:id,name,email,preferred_color',
        ])
        ->get();

    $friends = collect();

    foreach ($friendships as $friendship) {
        if ($friendship->sender_id === $user->id) {
            $friends->push($friendship->receiver);
        } else {
            $friends->push($friendship->sender);
        }
    }

    $friends = $friends->unique('id')->values()->map(function ($friend) {
        return [
            'id' => $friend->id,
            'name' => $friend->name,
            'email' => $friend->email,
            'preferred_color' => $friend->preferred_color ?? '#E65C00',
        ];
    });

    return response()->json(['data' => $friends]);
}


}
