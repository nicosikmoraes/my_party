<?php

namespace App\Models;


use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Friendship;

class User extends Authenticatable
{

    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'shirt_size',
        'shoe_size',
        'pants_size',
        'ring_size',
        'preferred_color'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    
    public function gifts()
    {
        return $this->hasMany(Gift::class);
    }


    // Para ver os amigos
    public function sentFriendRequests()
    {
        return $this->hasMany(Friendship::class, 'sender_id');
    }

    public function receivedFriendRequests()
    {
        return $this->hasMany(Friendship::class, 'receiver_id');
    }

     public function friends()
    {
        return User::whereIn('id', function ($query) {
            $query->select('receiver_id')
                ->from('friendships')
                ->where('sender_id', $this->id)
                ->where('status', 'accepted');
        })->orWhereIn('id', function ($query) {
            $query->select('sender_id')
                ->from('friendships')
                ->where('receiver_id', $this->id)
                ->where('status', 'accepted');
        });
    }
}