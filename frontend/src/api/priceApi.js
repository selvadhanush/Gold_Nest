import api from './axios';

export const getCurrentPrices = async () => {
  const response = await api.get('/prices/current');
  return response.data;
};

export const getPriceHistory = async (metalType, days = 7) => {
  const response = await api.get(`/prices/history?metalType=${metalType}&days=${days}`);
  return response.data;
};