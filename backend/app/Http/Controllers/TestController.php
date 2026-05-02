<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class TestController extends Controller
{
    /**
     * Display a test message.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'message' => 'Test data from backend!',
            'timestamp' => now()->toDateTimeString(),
        ]);
    }
}