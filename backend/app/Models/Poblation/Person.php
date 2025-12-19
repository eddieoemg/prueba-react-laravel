<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Person extends Model
{
    protected $table = 'persona';
    protected $primaryKey = 'id';

    protected $fillable = [
        'nombre',
        'paterno',
        'materno',
    ];

    public function phones(): HasMany
    {
        return $this->hasMany(Phone::class, 'persona_id');
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class, 'persona_id');
    }
}
