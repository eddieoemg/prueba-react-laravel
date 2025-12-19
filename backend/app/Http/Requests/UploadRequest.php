<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'archivo' => 'required|file|mimes:csv|max:10240',
        ];
    }

    public function messages(): array
    {
        return [
            'archivo.required' => 'El archivo es requerido',
            'archivo.file' => 'Debe ser un archivo válido',
            'archivo.mimes' => 'El archivo debe ser de tipo Excel (xlsx, xls)',
            'archivo.max' => 'El archivo no debe exceder 10MB',
        ];
    }
}
