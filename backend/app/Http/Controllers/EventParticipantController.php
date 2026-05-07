<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\JsonResponse;

class EventParticipantController extends Controller
{
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