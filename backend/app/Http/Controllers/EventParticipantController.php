<?php

namespace App\Http\Controllers;

use App\Http\Requests\InviteEventParticipantRequest;
use App\Models\Event;
use App\Models\EventParticipant;
use Illuminate\Http\JsonResponse;

class EventParticipantController extends Controller
{
    public function invite(InviteEventParticipantRequest $request, Event $event): JsonResponse
    {
        $user = $request->user();
        $userIdToInvite = $request->validated('user_id');

        if ($event->created_by_user_id !== $user->id) {
            return response()->json(['message' => 'You do not have permission to invite users to this event'], 403);
        }

        if ((int) $userIdToInvite === $user->id) {
            return response()->json(['message' => 'You cannot invite yourself to the event'], 400);
        }

        $existingParticipant = EventParticipant::where('event_id', $event->id)
            ->where('user_id', $userIdToInvite)
            ->first();

        if ($existingParticipant) {
            return response()->json(['message' => 'User already invited'], 400);
        }

        EventParticipant::create([
            'event_id' => $event->id,
            'user_id' => $userIdToInvite,
            'is_accepted' => false,
        ]);

        return response()->json(['message' => 'User invited successfully'], 200);
    }

    public function accept(Event $event): JsonResponse
    {
        $user = auth()->user();

        $participant = $event->participants()->where('user_id', $user->id)->first();

        if (!$participant) {
            return response()->json(['message' => 'Você não é um participante deste evento ou o convite não existe.'], 404);
        }

        $participant->update(['is_accepted' => true]);

        return response()->json(['message' => 'Convite aceito com sucesso.'], 200);
    }

    public function decline(Event $event): JsonResponse
    {
        $user = auth()->user();

        $participant = $event->participants()->where('user_id', $user->id)->first();

        if (!$participant) {
            return response()->json(['message' => 'Você não é um participante deste evento ou o convite não existe.'], 404);
        }

        $participant->delete(); // Remove the participation record

        return response()->json(['message' => 'Convite recusado com sucesso.'], 200);
    }
}
