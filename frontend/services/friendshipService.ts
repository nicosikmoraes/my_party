import api from './api';
import { FriendshipRequest } from '@/types/friendship'; // Assumindo que você tem um type FriendshipRequest

export const sendFriendRequest = async (receiverId: number) => {
  return api.post('/friends/request', { receiver_id: receiverId });
};

export const getFriendRequests = async () => {
  return api.get<{ data: FriendshipRequest[] }>('/friends/requests');
};

export const acceptFriendRequest = async (friendshipId: number) => {
  return api.post(`/friends/${friendshipId}/accept`);
};