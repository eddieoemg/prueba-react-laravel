<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_procesar_carga');

        DB::unprepared("
   CREATE PROCEDURE sp_procesar_carga(IN p_user_id BIGINT)
           BEGIN
                INSERT IGNORE INTO persona (nombre, paterno, materno, created_at, updated_at)
                SELECT DISTINCT nombre, paterno, materno, NOW(), NOW()
                FROM carga_temporal
                WHERE user_id = p_user_id;

                INSERT IGNORE INTO telefono (persona_id, telefono, created_at, updated_at)
                SELECT DISTINCT p.id, ct.telefono, NOW(), NOW()
                FROM carga_temporal ct
                INNER JOIN persona p ON p.nombre = ct.nombre
                    AND p.paterno = ct.paterno
                    AND COALESCE(p.materno, '') = COALESCE(ct.materno, '')
                WHERE ct.user_id = p_user_id
                    AND ct.telefono IS NOT NULL
                    AND TRIM(ct.telefono) != '';

                INSERT INTO direccion (persona_id, calle, numero_exterior, numero_interior, colonia, cp, created_at, updated_at)
                SELECT DISTINCT p.id, ct.calle, ct.numero_exterior, ct.numero_interior, ct.colonia, ct.cp, NOW(), NOW()
                FROM carga_temporal ct
                INNER JOIN persona p ON p.nombre = ct.nombre
                    AND p.paterno = ct.paterno
                    AND COALESCE(p.materno, '') = COALESCE(ct.materno, '')
                WHERE ct.user_id = p_user_id
                    AND ct.calle IS NOT NULL
                    AND TRIM(ct.calle) != '';

                DELETE FROM carga_temporal WHERE user_id = p_user_id;
            END
        ");
    }

    public function down(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_procesar_carga');
    }
};
