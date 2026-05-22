export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
}

export type FriendProfileUser = {
  id: number;
  name: string;
  email?: string;
  shirt_size?: string | null;
  shoe_size?: number | null;
  pants_size?: number | null;
  ring_size?: number | null;
  prefered_color?: string | null;
  avatar_url?: string | null;
};

export type FriendProfileGift = {
  id: number;
  name: string;
  type?: string | null;
  price?: number | string | null;
  quantity?: number | null;
  description?: string | null;
  color?: string | null;
};

export type FriendProfileResponse = {
  user: FriendProfileUser;
  wishlist: FriendProfileGift[];
};
