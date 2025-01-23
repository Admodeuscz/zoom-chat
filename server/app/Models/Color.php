<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Operator;


class Color extends Model
{
    use HasFactory;
    protected $table = 'colors';
    protected $fillable = ['color_value'];
    public $timestamps = false;

    public function operators()
    {
        return $this->hasMany(Operator::class, 'color_id', 'id');
    }
}
