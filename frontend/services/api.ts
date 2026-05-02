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