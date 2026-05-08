export interface EventTypeOption {
  label: string;
  value: string;
}

export interface UserBasic {
  id: number;
  name: string;
  email: string;
  pivot?: {
    is_accepted?: boolean | number;
  };
}

export interface EventParticipant {
  id: number;
  event_id: number;
  user_id: number;
  is_accepted: boolean;
  user: UserBasic; // Assuming eager loaded user
}

export interface Event {
  id: number;
  created_by_user_id: number;
  title: string;
  type: string;
  date: string;
  address: string;
  description?: string;
  creator: UserBasic;
  participants?: EventParticipant[];
  users: UserBasic[]; // Users related through event_participants
}

export interface CreateEventPayload {
  title: string;
  type: string;
  date: string;
  address: string;
  description?: string;
  participants?: number[]; // Array of user IDs
}

export interface UpdateEventPayload {
  title: string;
  type: string;
  date: string;
  address: string;
  description?: string;
}
