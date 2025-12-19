<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Phone extends Model
{
    protected $table = 'telefono';
    protected $primaryKey = 'id';

    protected $fillable = [
        'persona_id',
        'telefono',
    ];

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'persona_id');
    }
}
