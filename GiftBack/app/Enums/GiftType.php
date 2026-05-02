<?php

namespace App\Enums;

enum GiftType: string
{
    case CLOTHING = 'clothing';
    case SHOES = 'shoes';
    case ACCESSORIES = 'accessories';

    case ELECTRONICS = 'electronics';
    case HOME_APPLIANCES = 'home_appliances';

    case FURNITURE = 'furniture';
    case HOME_DECOR = 'home_decor';

    case BEAUTY = 'beauty';
    case HEALTH = 'health';

    case SPORTS = 'sports';
    case OUTDOOR = 'outdoor';

    case TOYS = 'toys';
    case GAMES = 'games';

    case BOOKS = 'books';
    case ART = 'art';

    case FOOD = 'food';
    case DRINKS = 'drinks';

    case PETS = 'pets';

    case OFFICE = 'office';
    case STATIONERY = 'stationery';

    case AUTOMOTIVE = 'automotive';

    case MUSIC = 'music';
    case MOVIES = 'movies';

    case TRAVEL = 'travel';

    case OTHER = 'other';
    
 public function label(): string
    {
        return match($this) {
            self::CLOTHING => 'Clothing',
            self::SHOES => 'Shoes',
            self::ACCESSORIES => 'Accessories',

            self::ELECTRONICS => 'Electronics',
            self::HOME_APPLIANCES => 'Home Appliances',

            self::FURNITURE => 'Furniture',
            self::HOME_DECOR => 'Home Decor',

            self::BEAUTY => 'Beauty',
            self::HEALTH => 'Health',

            self::SPORTS => 'Sports',
            self::OUTDOOR => 'Outdoor',

            self::TOYS => 'Toys',
            self::GAMES => 'Games',

            self::BOOKS => 'Books',
            self::ART => 'Art',

            self::FOOD => 'Food',
            self::DRINKS => 'Drinks',

            self::PETS => 'Pets',

            self::OFFICE => 'Office',
            self::STATIONERY => 'Stationery',

            self::AUTOMOTIVE => 'Automotive',

            self::MUSIC => 'Music',
            self::MOVIES => 'Movies',

            self::TRAVEL => 'Travel',

            self::OTHER => 'Other',
        };
    }
}

