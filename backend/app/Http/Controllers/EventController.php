<?php

namespace App\Http\Controllers;

use App\Enums\EventType;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use App\Models\EventParticipant;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();

        $events = Event::where('created_by_user_id', $user->id)
                        ->orWhereHas('participants', function ($query) use ($user) {
                            $query->where('user_id', $user->id);
                        })
                        ->with('creator:id,name,email', 'users:id,name,email')
                        ->get();

        return response()->json($events);
    }

    public function show(Event $event): JsonResponse
    {
        $user = auth()->user();

        if ($event->created_by_user_id !== $user->id && !$event->users->contains($user->id)) {
            return response()->json(['message' => 'Você não tem permissão para ver este evento.'], 403);
        }

        $event->load('creator:id,name,email', 'users:id,name,email');

        return response()->json($event);
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        $user = $request->user();

        try {
            DB::beginTransaction();

            $event = Event::create([
                'created_by_user_id' => $user->id,
                'title' => $request->title,
                'type' => $request->type,
                'date' => $request->date,
                'address' => $request->address,
                'description' => $request->description,
            ]);

            if ($request->has('participants')) {
                $participantIds = array_unique($request->participants);
                
                // Ensure participants are friends to the event creator
                $friends = $user->friends()->whereIn('receiver_id', $participantIds)
                               ->orWhereIn('sender_id', $participantIds)
                               ->accepted()
                               ->get()
                               ->pluck('id');

                $validParticipantIds = User::whereIn('id', $participantIds)
                                           ->where(function ($query) use ($user) {
                                               $query->whereHas('friendsAsSender', function ($q) use ($user) {
                                                   $q->where('receiver_id', $user->id)->where('status', 'accepted');
                                               })
                                               ->orWhereHas('friendsAsReceiver', function ($q) use ($user) {
                                                   $q->where('sender_id', $user->id)->where('status', 'accepted');
                                               });
                                           })
                                           ->pluck('id')
                                           ->toArray();

                foreach ($validParticipantIds as $participantId) {
                    if ($participantId !== $user->id) { // Ensure creator is not added as participant
                        EventParticipant::firstOrCreate([
                            'event_id' => $event->id,
                            'user_id' => $participantId,
                        ], [
                            'is_accepted' => false,
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json($event->load('creator:id,name,email', 'users:id,name,email'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao criar evento.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateEventRequest $request, Event $event): JsonResponse
    {
        if ($event->created_by_user_id !== $request->user()->id) {
            return response()->json(['message' => 'Você não tem permissão para editar este evento.'], 403);
        }

        $event->update($request->validated());

        return response()->json($event->load('creator:id,name,email'), 200);
    }

    public function destroy(Event $event): JsonResponse
    {
        if ($event->created_by_user_id !== auth()->user()->id) {
            return response()->json(['message' => 'Você não tem permissão para excluir este evento.'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'Evento excluído com sucesso.'], 200);
    }

    public function types(): JsonResponse
    {
        $types = collect(EventType::cases())->map(fn ($type) => [
            'label' => $type->label(),
            'value' => $type->value,
        ]);

        return response()->json($types);
    }
}