<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Operator extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

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

    public function getAuthPassword()
    {
        return $this->pwd;
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['pwd'] = Hash::make($value);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_id', 'team_id');
    }

    public function channels(): HasMany
    {
        return $this->hasMany(Channel::class, 'created_by', 'op_id');
    }
}
