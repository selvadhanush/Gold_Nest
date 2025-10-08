exports.calculatePortfolioValue = (holdings, currentPrices) => {
  let totalCurrentValue = 0;
  let totalInvested = 0;

  holdings.forEach(holding => {
    const currentPrice = currentPrices[holding.metalType];
    const currentValue = holding.weightInGrams * currentPrice.pricePerGram;
    
    totalCurrentValue += currentValue;
    totalInvested += holding.totalInvestedAmount;
  });

  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 
    ? ((totalGainLoss / totalInvested) * 100).toFixed(2)
    : 0;

  return {
    totalCurrentValue: parseFloat(totalCurrentValue.toFixed(2)),
    totalInvested: parseFloat(totalInvested.toFixed(2)),
    totalGainLoss: parseFloat(totalGainLoss.toFixed(2)),
    totalGainLossPercent: parseFloat(totalGainLossPercent)
  };
};

exports.calculateHoldingDetails = (holding, currentPrice) => {
  const currentValue = holding.weightInGrams * currentPrice.pricePerGram;
  const gainLoss = currentValue - holding.totalInvestedAmount;
  const gainLossPercent = holding.totalInvestedAmount > 0
    ? ((gainLoss / holding.totalInvestedAmount) * 100).toFixed(2)
    : 0;

  return {
    metalType: holding.metalType,
    purity: holding.purity,
    weightInGrams: holding.weightInGrams,
    averagePurchasePrice: holding.averagePurchasePrice,
    currentPricePerGram: currentPrice.pricePerGram,
    currentValue: parseFloat(currentValue.toFixed(2)),
    investedAmount: holding.totalInvestedAmount,
    gainLoss: parseFloat(gainLoss.toFixed(2)),
    gainLossPercent: parseFloat(gainLossPercent)
  };
};

exports.calculateTransactionStats = (transactions) => {
  let totalPurchases = 0;
  let totalSales = 0;
  let purchaseCount = 0;
  let salesCount = 0;

  transactions.forEach(transaction => {
    if (transaction.type.startsWith('buy_')) {
      totalPurchases += transaction.totalAmount;
      purchaseCount++;
    } else if (transaction.type.startsWith('sell_')) {
      totalSales += transaction.totalAmount;
      salesCount++;
    }
  });

  return {
    totalPurchases: parseFloat(totalPurchases.toFixed(2)),
    totalSales: parseFloat(totalSales.toFixed(2)),
    purchaseCount,
    salesCount,
    netAmount: parseFloat((totalSales - totalPurchases).toFixed(2))
  };
};