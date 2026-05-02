import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "http://192.168.3.154:8000/api",
});

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("Usuário não autenticado");
    }

    return Promise.reject(error);
  },
);
