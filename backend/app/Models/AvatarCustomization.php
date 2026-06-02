<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AvatarCustomization extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'skin_color',
        'hair_color',
        'shirt_color',
        'pants_color',
        'shoes_color',
        'hair_style',
        'shirt_model',
        'pants_model',
        'shoes_model',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}