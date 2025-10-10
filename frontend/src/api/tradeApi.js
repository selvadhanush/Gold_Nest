import api from './axios';

export const buyMetal = async (metalType, amountInRupees, weightInGrams) => {
  const response = await api.post('/trade/buy', {
    metalType,
    amountInRupees,
    weightInGrams
  });
  return response.data;
};

export const sellMetal = async (metalType, weightInGrams) => {
  const response = await api.post('/trade/sell', {
    metalType,
    weightInGrams
  });
  return response.data;
};

export const getHoldings = async () => {
  const response = await api.get('/trade/holdings');
  return response.data;
};

export const getPortfolio = async () => {
  const response = await api.get('/trade/portfolio');
  return response.data;
};