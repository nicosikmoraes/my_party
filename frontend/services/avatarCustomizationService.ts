import { api } from "./api";
import { AvatarCustomization, UpdateAvatarCustomizationPayload } from "../types/avatar";

export const getAvatarCustomization = async (): Promise<AvatarCustomization> => {
    const response = await api.get<AvatarCustomization>("/avatar-customization");
    return response.data;
};

export const updateAvatarCustomization = async (
    payload: UpdateAvatarCustomizationPayload
): Promise<AvatarCustomization> => {
    const response = await api.put<AvatarCustomization>("/avatar-customization", payload);
    return response.data;
};
