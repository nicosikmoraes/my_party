import { api } from "./api";
import { FriendshipRequest } from "@/types/friendship";
import { Friend } from "../types/friend";

export const sendFriendRequest = async (receiverId: number) => {
  return api.post("/friends/send", { receiver_id: receiverId });
};

export async function getFriendRequests(): Promise<FriendshipRequest[]> {
  const response = await api.get<FriendshipRequest[]>("/friends/requests");
  return response.data;
}

export const acceptFriendRequest = async (friendshipId: number) => {
  return api.post(`/friends/${friendshipId}/accept`);
};

export async function getFriends(): Promise<Friend[]> {
  const response = await api.get("/friends");
  return response.data.data;
}
