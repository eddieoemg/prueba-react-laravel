<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_consultar_personas');

        DB::unprepared("
            CREATE PROCEDURE sp_consultar_personas(IN p_offset INT, IN p_limit INT)
            BEGIN
                SELECT
                    p.id,
                    p.nombre,
                    p.paterno,
                    p.materno,
                    p.created_at,
                    (SELECT COUNT(*) FROM telefono t WHERE t.persona_id = p.id) AS total_telefonos,
                    (SELECT COUNT(*) FROM direccion d WHERE d.persona_id = p.id) AS total_direcciones
                FROM persona p
                ORDER BY p.id
                LIMIT p_limit OFFSET p_offset;
            END
        ");
    }

    public function down(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_consultar_personas');
    }
};
