<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    /**
     * Retorna o nome do usuário autenticado invertido.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function reversedName(Request $request)
    {
        $user = $request->user();
        $reversedName = strrev($user->name);

        return response()->json([
            'reversed_name' => $reversedName,
        ]);
    }
}

# MANUAL_UPDATE: backend/routes/api.php
Adicionar o import:
use App\Http\Controllers\TestController;

Dentro do grupo Route::middleware('auth:sanctum')->group(function () { ... }), adicionar:
Route::get('/test/reversed-name', [TestController::class, 'reversedName']);