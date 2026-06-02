export type AvatarCustomization = {
    id?: number;
    user_id?: number;
    skin_color: string | null;
    hair_color: string | null;
    shirt_color: string | null;
    pants_color: string | null;
    shoes_color: string | null;
    hair_style: string | null;
    shirt_model: string | null;
    pants_model: string | null;
    shoes_model: string | null;
    created_at?: string;
    updated_at?: string;
};

export type UpdateAvatarCustomizationPayload = {
    skin_color?: string;
    hair_color?: string;
    shirt_color?: string;
    pants_color?: string;
    shoes_color?: string;
    hair_style?: string | null;
    shirt_model?: string | null;
    pants_model?: string | null;
    shoes_model?: string | null;
};
