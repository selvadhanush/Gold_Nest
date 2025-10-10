import api from './axios';

export const getTransactionHistory = async (page = 1, limit = 10) => {
  const response = await api.get(`/transactions/history?page=${page}&limit=${limit}`);
  return response.data;
};

export const getTransactionStats = async () => {
  const response = await api.get('/transactions/stats');
  return response.data;
};