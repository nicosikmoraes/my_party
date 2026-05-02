import { api } from "./api";

export type ReversedNameResponse = {
  reversed_name: string;
};

export const testService = {
  async getReversedName(): Promise<ReversedNameResponse> {
    const response = await api.get<ReversedNameResponse>("/test/reversed-name");

    return response.data;
  },
};
