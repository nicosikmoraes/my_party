import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export async function saveToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem("token", token);
  } else {
    await SecureStore.setItemAsync("token", token);
  }
}

export async function getToken() {
  if (Platform.OS === "web") {
    return localStorage.getItem("token");
  }

  return await SecureStore.getItemAsync("token");
}

export async function removeToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem("token");
  } else {
    await SecureStore.deleteItemAsync("token");
  }
}
