<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    protected $table = 'direccion';
    protected $primaryKey = 'id';

    protected $fillable = [
        'persona_id',
        'calle',
        'numero_exterior',
        'numero_interior',
        'colonia',
        'cp',
    ];

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'persona_id');
    }
}
