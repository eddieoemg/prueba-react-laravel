<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_detalle_persona');

        /*DB::unprepared('CREATE PROCEDURE sp_detalle_persona(IN p_id_persona BIGINT)
            BEGIN
                SELECT id_persona, nombre, paterno, materno, created_at
                FROM persona
                WHERE id_persona = p_id_persona;

                SELECT id_telefono, telefono
                FROM telefono
                WHERE id_persona = p_id_persona;

            END');
       */
        DB::unprepared("
            CREATE PROCEDURE sp_detalle_persona(IN p_id BIGINT)
            BEGIN
                SELECT id, nombre, paterno, materno, created_at
                FROM persona
                WHERE id = p_id;

                SELECT id, telefono
                FROM telefono
                WHERE persona_id = p_id;

                SELECT id, calle, numero_exterior, numero_interior, colonia, cp
                FROM direccion
                WHERE persona_id = p_id;
            END
        ");
    }

    public function down(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_detalle_persona');
    }
};
