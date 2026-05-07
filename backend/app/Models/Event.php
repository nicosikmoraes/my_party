<?php

namespace App\Models;

use App\Enums\EventType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by_user_id',
        'title',
        'type',
        'date',
        'address',
        'description',
    ];

    protected $casts = [
        'date' => 'datetime',
        'type' => EventType::class,
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(EventParticipant::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_participants')
                    ->withPivot('is_accepted')
                    ->withTimestamps();
    }
}