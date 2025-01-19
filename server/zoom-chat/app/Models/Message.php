<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Message extends Model
{
    protected $table = 'messages';
    protected $primaryKey = 'message_id';

    protected $fillable = [
        'channel_id',
        'sender_id',
        'content',
        'message_type',
        'parent_message_id',
        'is_deleted',
    ];

    public function channel(): BelongsTo
    {
        return $this->belongsTo(Channel::class, 'channel_id', 'channel_id');
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(Operator::class, 'sender_id', 'op_id');
    }

    public function parentMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'parent_message_id', 'message_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Message::class, 'parent_message_id', 'message_id');
    }

    public function readers(): BelongsToMany
    {
        return $this->belongsToMany(Operator::class, 'message_reads', 'message_id', 'op_id')
            ->withPivot('read_at');
    }
} 