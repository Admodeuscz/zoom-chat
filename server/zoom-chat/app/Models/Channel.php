<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Channel extends Model
{
    protected $table = 'channels';
    protected $primaryKey = 'channel_id';

    protected $fillable = [
        'channel_name',
        'created_by',
        'description',
        'channel_type',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Operator::class, 'created_by', 'op_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(Operator::class, 'channel_members', 'channel_id', 'op_id')
            ->withPivot(['background_color', 'joined_at', 'left_at', 'is_active']);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'channel_id', 'channel_id');
    }

    public function colors(): HasMany
    {
        return $this->hasMany(ChannelColor::class, 'channel_id', 'channel_id');
    }
} 