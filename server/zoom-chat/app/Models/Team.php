<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    protected $table = 'teams';
    protected $primaryKey = 'team_id';
    public $timestamps = false;

    protected $fillable = [
        'team_name',
        'memo',
    ];

    protected $dates = [
        'regist_date',
        'update_date',
    ];

    public function operators(): HasMany
    {
        return $this->hasMany(Operator::class, 'team_id', 'team_id');
    }
} 