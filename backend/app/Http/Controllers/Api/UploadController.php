<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use App\Http\Requests\UploadRequest;
use App\Services\UploadService;
use App\Http\Controllers\Controller;

class UploadController extends Controller
{
    protected UploadService $uploadService;

    public function __construct(UploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    public function upload(UploadRequest $request): JsonResponse
    {
        try {
            $file = $request->file('archivo');

            $result = $this->uploadService->processExcel($file, $request->user()->id);

            return response()->json([
                'message' => 'Archivo procesado correctamente',
                'registros_cargados' => $result['records'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al procesar el archivo',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
