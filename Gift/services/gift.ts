import { api } from "./api";

export async function createGift(payload: any) {
  try {
    const response = await api.post("/gifts/create", payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function getGiftTypes() {
  const response = await api.get("/gifts/type");
  return response.data;
}

export async function getUserGifts() {
  const response = await api.get("/gifts");
  return response.data;
}

export async function markAsPurchased(id: number) {
  const response = await api.patch(`/gifts/${id}/purchase`);
  return response.data;
}
