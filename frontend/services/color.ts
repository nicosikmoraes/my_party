import { api } from "./api";

export async function getColors() {
  const response = await api.get("/colors");
  return response.data;
}
