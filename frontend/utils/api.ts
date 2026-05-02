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