<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_total_personas');

        DB::unprepared("
            CREATE PROCEDURE sp_total_personas()
            BEGIN
                SELECT COUNT(*) AS total FROM persona;
            END
        ");
    }

    public function down(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_total_personas');
    }
};
