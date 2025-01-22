<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;
    protected $table = 'messages';
    protected $primaryKey = 'message_id';

    protected $fillable = [
        'sender_id',
        'content',
        'receiver_id',
        'parent_message_id',
        'is_deleted',
        'reactions',
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(Operator::class, 'sender_id', 'op_id');
    }
    
    public function receiver(): BelongsTo
    {
        return $this->belongsTo(Operator::class, 'receiver_id', 'op_id');
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
