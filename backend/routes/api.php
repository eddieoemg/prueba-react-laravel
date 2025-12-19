<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PersonController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;


Route::prefix('auth')->group(function () {
    Route::post('login',  [AuthController::class, 'login']);
});

Route::middleware('auth:api')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/persons', [PersonController::class, 'index']);
    Route::get('/persons/{id}', [PersonController::class, 'show']);
    Route::post('/persons/{id}', [PersonController::class, 'store']);

    Route::resource('users', UserController::class);

    Route::middleware('role:admin')->group(function () {
        Route::post('/upload', [UploadController::class, 'upload']);
    });
});

