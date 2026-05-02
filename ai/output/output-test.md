# FILE: backend/app/Http/Controllers/TestController.php
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

# FILE: backend/routes/api.php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

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

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Módulo Gifts
    // Route::post('/gifts/create', [GiftController::class, 'create']);
    // Route::get('/gifts/user', [GiftController::class, 'userGifts']);

    // Módulo Amizades
    // Route::post('/friends/request', [FriendshipController::class, 'sendRequest']);
    // Route::get('/friends/requests', [FriendshipController::class, 'getRequests']);

    // Busca de usuários
    // Route::get('/users/search', [UserController::class, 'search']);

    // Nova rota para o TestController
    Route::get('/test', [TestController::class, 'index']);
});

# FILE: frontend/utils/api.ts
import axios from 'axios';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Altere para a URL da sua API Laravel
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    // Exemplo: Obter token de autenticação de algum armazenamento seguro (e.g., AsyncStorage)
    // const token = await AsyncStorage.getItem('userToken');
    // Para fins de teste, você pode simular um token ou garantir que a rota de teste não exija autenticação
    const token = 'YOUR_MOCK_AUTH_TOKEN'; // Substitua por lógica real de obtenção de token

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status code fora da faixa 2xx
      console.error('API Error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      // Você pode adicionar um toast ou alerta aqui
      // Alert.alert('Erro na API', error.response.data.message || 'Ocorreu um erro.');
    } else if (error.request) {
      // A requisição foi feita, mas nenhuma resposta foi recebida
      console.error('No response received:', error.request);
      // Alert.alert('Erro de Rede', 'Não foi possível conectar ao servidor.');
    } else {
      // Algo aconteceu na configuração da requisição que disparou um erro
      console.error('Error setting up request:', error.message);
      // Alert.alert('Erro', 'Ocorreu um erro inesperado.');
    }
    return Promise.reject(error);
  }
);

export default api;

# FILE: frontend/services/TestService.ts
import api from '../utils/api';

export const TestService = {
  async getTestData() {
    try {
      const response = await api.get('/test');
      return response.data;
    } catch (error) {
      console.error('Error fetching test data:', error);
      throw error;
    }
  },
};

# FILE: frontend/app/screens/TestScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { TestService } from '../../services/TestService';

interface TestData {
  message: string;
  timestamp: string;
}

export default function TestScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TestData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await TestService.getTestData();
        setData(result);
        Alert.alert('Sucesso', 'Dados de teste carregados com sucesso!');
      } catch (err: any) {
        console.error("Failed to fetch test data:", err);
        setError(err.response?.data?.message || 'Erro ao carregar dados de teste.');
        Alert.alert('Erro', err.response?.data?.message || 'Erro ao carregar dados de teste.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Screen</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>Erro: {error}</Text>
      ) : (
        <View>
          <Text style={styles.dataText}>Mensagem: {data?.message}</Text>
          <Text style={styles.dataText}>Timestamp: {data?.timestamp}</Text>
        </View>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dataText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});