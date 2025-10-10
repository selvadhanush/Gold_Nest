import api from './axios';

export const getWalletBalance = async () => {
  const response = await api.get('/wallet/balance');
  return response.data;
};

export const depositMoney = async (amount) => {
  const response = await api.post('/wallet/deposit', { amount });
  return response.data;
};

export const withdrawMoney = async (amount) => {
  const response = await api.post('/wallet/withdraw', { amount });
  return response.data;
};