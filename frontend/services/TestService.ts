import api from '../utils/api';

export const TestService = {
  async getTestData() {
    try {
      const response = await api.get('/test');
      return response.data;
    } catch (error) {
      console.error('Error fetching test data:', error);
      throw error;
    }
  },
};