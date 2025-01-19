<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Operator extends Authenticatable
{
    protected $table = 'operators';
    protected $primaryKey = 'op_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'op_id',
        'op_name',
        'op_name_kana',
        'pwd',
        'team_id',
    ];

    protected $hidden = [
        'pwd',
    ];

    protected $dates = [
        'regist_date',
        'update_date',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_id', 'team_id');
    }

    public function channels(): HasMany
    {
        return $this->hasMany(Channel::class, 'created_by', 'op_id');
    }
} 