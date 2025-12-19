<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class PersonController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = $request->input('page', 1);
        $limit = 100;
        $offset = ($page - 1) * $limit;

        $personas = DB::select('CALL sp_consultar_personas(?, ?)', [$offset, $limit]);
        $total = DB::select('CALL sp_total_personas()');

        return response()->json([
            'data' => $personas,
            'pagination' => [
                'total' => $total[0]->total,
                'per_page' => $limit,
                'current_page' => (int) $page,
                'last_page' => ceil($total[0]->total / $limit),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $results = DB::select('CALL sp_detalle_persona(?)', [$id]);

        if (empty($results)) {
            return response()->json([
                'message' => 'Persona no encontrada',
            ], 404);
        }

        $pdo = DB::getPdo();
        $stmt = $pdo->prepare('CALL sp_detalle_persona(?)');

        $stmt->execute([$id]);

        $persona = $stmt->fetchAll(\PDO::FETCH_OBJ);
        $stmt->nextRowset();
        $telefonos = $stmt->fetchAll(\PDO::FETCH_OBJ);
        $stmt->nextRowset();
        $direcciones = $stmt->fetchAll(\PDO::FETCH_OBJ);

        if (empty($persona)) {
            return response()->json([
                'message' => 'Persona no encontrada',
            ], 404);
        }

        return response()->json([
            'persona' => $persona[0],
            'telefonos' => $telefonos,
            'direcciones' => $direcciones,
        ]);
    }
}
