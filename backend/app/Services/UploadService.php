<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PDO;

class UploadService
{
    public function processExcel(UploadedFile $file, int $userId): array
    {
        $name = 'tmp_' . Str::random(20) . '.csv';
        $path = 'temp/' . $name;

        Storage::disk('local')->put($path, $file->getContent());
        $fullPath = storage_path('app/private/temp/' . $name);

        try {
            $this->validateHeaders($fullPath);
            $records = $this->countLines($fullPath) - 1;

            $this->loadDataInfile($fullPath, $userId);
            DB::statement('CALL sp_procesar_carga(?)', [$userId]);

            return ['records' => $records];
        } finally {
            Storage::disk('local')->delete($path);
        }
    }

    private function validateHeaders(string $path): void
    {
        $handle = fopen($path, 'r');
        $headers = array_map('strtolower', array_map('trim', fgetcsv($handle)));
        fclose($handle);

        $required = ['nombre', 'paterno'];
        foreach ($required as $col) {
            if (!in_array($col, $headers)) {
                throw new \Exception("Columna '$col' requerida");
            }
        }
    }

    private function loadDataInfile(string $csvPath, int $userId): void
    {
        $csvPath = str_replace('\\', '/', $csvPath);

        $sql = "LOAD DATA LOCAL INFILE '{$csvPath}'
                INTO TABLE carga_temporal
                FIELDS TERMINATED BY ','
                ENCLOSED BY '\"'
                LINES TERMINATED BY '\\n'
                IGNORE 1 ROWS
                (nombre, paterno, materno, telefono, calle, numero_exterior, numero_interior, colonia, cp)
                SET user_id = {$userId}";


        $pdo = DB::connection()->getPdo();
        $pdo->setAttribute(PDO::MYSQL_ATTR_LOCAL_INFILE, true);
        $pdo->exec($sql);
    }

    private function countLines(string $path): int
    {
        return count(file($path));
    }
}
