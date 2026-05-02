<?php

namespace App\Enums;

enum Color: string
{
    case WHITE = 'white';
    case BLACK = 'black';
    case GRAY = 'gray';
    case SILVER = 'silver';

    case RED = 'red';
    case DARK_RED = 'dark_red';
    case PINK = 'pink';

    case BLUE = 'blue';
    case LIGHT_BLUE = 'light_blue';
    case NAVY = 'navy';

    case GREEN = 'green';
    case DARK_GREEN = 'dark_green';
    case LIME = 'lime';

    case YELLOW = 'yellow';
    case GOLD = 'gold';

    case ORANGE = 'orange';

    case PURPLE = 'purple';
    case VIOLET = 'violet';

    case BROWN = 'brown';
    case BEIGE = 'beige';

    public function label(): string
    {
        return ucfirst(str_replace('_', ' ', $this->value));
    }
}