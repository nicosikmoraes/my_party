import api from './api';

interface ReversedNameResponse {
  reversed_name: string;
}

export const testService = {
  getReversedName: async (): Promise<ReversedNameResponse> => {
    const response = await api.get('/test/reversed-name');
    return response.data;
  },
};