<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\GiftType;

class Gift extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'price',
        'quantity',
        'description',
        'color',
        'size',
        'type',
        'is_purchased',
    ];

    protected $casts = [
        'type' => GiftType::class,
        'is_purchased' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}