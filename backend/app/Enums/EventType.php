<?php

namespace App\Enums;

use App\Traits\HasEnumLabels;

enum EventType: string
{
    case Party = 'party';
    case SecretFriend = 'secret_friend';
    case Hangout = 'hangout';

    public function label(): string
    {
        return match ($this) {
            self::Party => 'Party',
            self::SecretFriend => 'Secret Friend',
            self::Hangout => 'Hangout',
        };
    }
}