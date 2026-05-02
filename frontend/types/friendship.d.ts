export interface FriendshipRequest {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
  sender: {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
  receiver: {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
}
