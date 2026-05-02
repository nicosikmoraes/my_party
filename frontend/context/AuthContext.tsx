import { AxiosError } from "axios";
import { router } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { getToken, removeToken, saveToken } from "../storage/auth";

export const AuthContext = createContext({} as any);

type User = {
  id: number;
  name: string;
  email: string;
};

type ErrorResponse = {
  message: string;
};

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post("/login", { email, password });

      const { user, token } = response.data;

      setUser(user);

      await saveToken(token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;

      const message = err?.response?.data?.message || "Erro ao fazer login";
      throw new Error(message);
    }
  }

  async function signOut() {
    await removeToken();

    delete api.defaults.headers.common["Authorization"];

    setUser(null);

    router.replace("/(app)/login");
  }

  async function loadUser() {
    try {
      const token = await getToken();

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await api.get("/user");

        setUser(response.data);
      }
    } catch (error) {
      await removeToken();

      setUser(null);
    }

    setLoading(false);
  }

  async function signInWithGoogle(googleToken: string) {
    try {
      const response = await api.post("/auth/google", {
        token: googleToken,
      });

      const { user, token } = response.data;

      setUser(user);

      await saveToken(token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return user;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Erro ao fazer login com Google";

      throw new Error(message);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ setUser, user, signIn, loading, signOut, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
}
