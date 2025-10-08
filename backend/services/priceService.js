const PriceHistory = require('../models/PriceHistory');

const basePrices = {
  gold: 6420.5,
  silver: 85.4
};

exports.getCurrentPrice = async (metalType) => {
  const fluctuation = (Math.random() - 0.5) * 2;
  const basePrice = basePrices[metalType];
  const pricePerGram = basePrice * (1 + fluctuation / 100);
  
  const changePercent = parseFloat(fluctuation.toFixed(2));

  return {
    metalType,
    purity: metalType === 'gold' ? '24k' : '999',
    pricePerGram: parseFloat(pricePerGram.toFixed(2)),
    changePercent,
    timestamp: new Date()
  };
};

exports.getAllCurrentPrices = async () => {
  const goldPrice = await this.getCurrentPrice('gold');
  const silverPrice = await this.getCurrentPrice('silver');
  
  return {
    gold: goldPrice,
    silver: silverPrice
  };
};

exports.getPriceHistory = async (metalType, days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const history = await PriceHistory.find({
    metalType,
    timestamp: { $gte: startDate }
  }).sort({ timestamp: 1 });

  return history;
};

exports.generateMockHistory = async (metalType, days = 7) => {
  const history = [];
  const now = new Date();
  const basePrice = basePrices[metalType];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const variation = (Math.random() - 0.5) * 5;
    const price = basePrice * (1 + variation / 100);

    history.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      metalType
    });
  }

  return history;
};