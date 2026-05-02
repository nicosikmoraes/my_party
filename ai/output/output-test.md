# FILE: backend/app/Http/Controllers/TestController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestController extends Controller
{
    public function getReversedUserName()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $reversedName = strrev($user->name);

        return response()->json(['reversed_name' => $reversedName]);
    }
}

# FILE: backend/routes/api.php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Existing routes (example placeholders, do not modify or remove)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    // Existing authenticated routes (example placeholders, do not modify or remove)
    // Gifts
    Route::post('/gifts/create', [GiftController::class, 'store']);
    Route::get('/gifts/user', [GiftController::class, 'index']);

    // Friends
    Route::post('/friends/request', [FriendController::class, 'sendRequest']);
    Route::get('/friends/requests', [FriendController::class, 'getRequests']);
    Route::get('/users/search', [UserController::class, 'search']);

    // ADD NEW ROUTE FOR TEST CONTROLLER
    Route::get('/test/reversed-name', [TestController::class, 'getReversedUserName']);
});

# FILE: frontend/services/api.ts
// Assume this file already contains the setup for the 'api' axios instance,
// including base URL, headers, and request interceptors for Authorization token.
// e.g., import axios from 'axios'; const api = axios.create(...); api.interceptors.request.use(...);
// And other existing exported functions like getGifts, createGift, etc.

// Example: import { api } from './axiosConfig'; // Assuming 'api' is exported from another file

// Placeholder for existing `api` instance. In a real app, 'api' would be properly defined or imported here.
// For the purpose of adding a function, we assume `api` is in scope.
import axios from 'axios';
const API_BASE_URL = 'http://localhost:8000/api'; // Adjust to your actual backend URL
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
// You would also have request interceptors here to add the auth token.
// Example:
// api.interceptors.request.use(async (config) => {
//     const token = await AuthTokenService.getToken(); // Assuming AuthTokenService exists
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });


// Add the new function
export const getReversedUserName = async (): Promise<{ reversed_name: string }> => {
    const response = await api.get('/test/reversed-name');
    return response.data;
};

# FILE: frontend/app/(auth)/TestScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { getReversedUserName } from '../../services/api'; // Adjust path based on your project structure

export default function TestScreen() {
    const [reversedName, setReversedName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReversedName = async () => {
            try {
                setLoading(true);
                const data = await getReversedUserName();
                setReversedName(data.reversed_name);
            } catch (err) {
                console.error('Failed to fetch reversed name:', err);
                setError('Erro ao carregar nome invertido. Tente novamente mais tarde.');
                // Here you might integrate a toast notification service if available
            } finally {
                setLoading(false);
            }
        };

        fetchReversedName();
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Nome Invertido' }} />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <Text style={styles.nameText}>
                    Nome do Usuário Invertido: {reversedName}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

# FILE: frontend/app/(auth)/events.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router'; // Ensure 'router' is imported from 'expo-router'

export default function EventsScreen() {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Eventos' }} />
            <Text style={styles.title}>Bem-vindo à tela de Eventos!</Text>
            <Text style={styles.description}>
                Aqui você poderá ver seus eventos e interações futuras.
            </Text>

            {/* ADD THE NEW BUTTON HERE */}
            <Button
                title="Ver Nome Invertido do Usuário"
                onPress={() => router.push('/testscreen')}
            />

            {/* Existing content continues below */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2c3e50',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#34495e',
    },
    // Add any other existing styles here
});