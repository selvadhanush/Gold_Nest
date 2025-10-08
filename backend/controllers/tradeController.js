const Holding = require('../models/Holding');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const priceService = require('../services/priceService');
const calculationService = require('../services/calculationService');
const { successResponse, errorResponse } = require('../utils/response');
const emailService = require('../services/emailService');

exports.buyMetal = async (req, res) => {
  try {
    const { metalType, amountInRupees, weightInGrams } = req.body;
    const userId = req.user._id;

    const currentPrice = await priceService.getCurrentPrice(metalType);
    
    let weight = weightInGrams;
    let totalAmount = amountInRupees;

    if (amountInRupees && !weightInGrams) {
      weight = amountInRupees / currentPrice.pricePerGram;
    } else if (weightInGrams && !amountInRupees) {
      totalAmount = weightInGrams * currentPrice.pricePerGram;
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return errorResponse(res, 'Wallet not found', 404);
    }

    if (wallet.balance < totalAmount) {
      return errorResponse(res, 'Insufficient wallet balance', 400);
    }

    wallet.balance -= totalAmount;
    await wallet.save();

    let holding = await Holding.findOne({ userId, metalType });
    
    if (holding) {
      const totalWeight = holding.weightInGrams + weight;
      const totalValue = holding.totalInvestedAmount + totalAmount;
      holding.weightInGrams = totalWeight;
      holding.totalInvestedAmount = totalValue;
      holding.averagePurchasePrice = totalValue / totalWeight;
    } else {
      holding = new Holding({
        userId,
        metalType,
        purity: metalType === 'gold' ? '24k' : '999',
        weightInGrams: weight,
        averagePurchasePrice: currentPrice.pricePerGram,
        totalInvestedAmount: totalAmount
      });
    }
    await holding.save();

    const transaction = await Transaction.create({
      userId,
      type: `buy_${metalType}`,
      metalType,
      weightInGrams: weight,
      pricePerGram: currentPrice.pricePerGram,
      totalAmount,
      status: 'completed',
      timestamp: new Date()
    });

    emailService.sendTransactionEmail(
      req.user.email,
      req.user.fullName,
      transaction
    ).catch(console.error);

    successResponse(res, {
      transaction,
      holding: {
        metalType: holding.metalType,
        weightInGrams: holding.weightInGrams,
        averagePurchasePrice: holding.averagePurchasePrice,
        totalInvestedAmount: holding.totalInvestedAmount
      },
      walletBalance: wallet.balance
    }, 'Purchase successful', 201);

  } catch (error) {
    console.error('Buy metal error:', error);
    errorResponse(res, 'Purchase failed', 500);
  }
};

exports.sellMetal = async (req, res) => {
  try {
    const { metalType, weightInGrams } = req.body;
    const userId = req.user._id;

    if (!weightInGrams || weightInGrams <= 0) {
      return errorResponse(res, 'Invalid weight', 400);
    }

    const currentPrice = await priceService.getCurrentPrice(metalType);
    
    const holding = await Holding.findOne({ userId, metalType });
    
    if (!holding) {
      return errorResponse(res, `No ${metalType} holdings found`, 404);
    }

    if (holding.weightInGrams < weightInGrams) {
      return errorResponse(res, 'Insufficient metal quantity', 400);
    }

    const totalAmount = weightInGrams * currentPrice.pricePerGram;

    const wallet = await Wallet.findOne({ userId });
    wallet.balance += totalAmount;
    await wallet.save();

    holding.weightInGrams -= weightInGrams;
    const proportionSold = weightInGrams / (holding.weightInGrams + weightInGrams);
    holding.totalInvestedAmount -= holding.totalInvestedAmount * proportionSold;

    if (holding.weightInGrams <= 0) {
      await Holding.deleteOne({ _id: holding._id });
    } else {
      await holding.save();
    }

    const transaction = await Transaction.create({
      userId,
      type: `sell_${metalType}`,
      metalType,
      weightInGrams,
      pricePerGram: currentPrice.pricePerGram,
      totalAmount,
      status: 'completed',
      timestamp: new Date()
    });

    emailService.sendTransactionEmail(
      req.user.email,
      req.user.fullName,
      transaction
    ).catch(console.error);

    successResponse(res, {
      transaction,
      remainingHolding: holding.weightInGrams > 0 ? {
        metalType: holding.metalType,
        weightInGrams: holding.weightInGrams,
        totalInvestedAmount: holding.totalInvestedAmount
      } : null,
      walletBalance: wallet.balance
    }, 'Sale successful', 201);

  } catch (error) {
    console.error('Sell metal error:', error);
    errorResponse(res, 'Sale failed', 500);
  }
};

exports.getHoldings = async (req, res) => {
  try {
    const holdings = await Holding.find({ userId: req.user._id });

    if (holdings.length === 0) {
      return successResponse(res, { holdings: [] }, 'No holdings found');
    }

    const currentPrices = await priceService.getAllCurrentPrices();

    const holdingsWithDetails = holdings.map(holding => {
      const currentPrice = currentPrices[holding.metalType];
      return calculationService.calculateHoldingDetails(holding, currentPrice);
    });

    successResponse(res, { holdings: holdingsWithDetails }, 'Holdings retrieved successfully');

  } catch (error) {
    console.error('Get holdings error:', error);
    errorResponse(res, 'Failed to get holdings', 500);
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;

    const holdings = await Holding.find({ userId });
    const wallet = await Wallet.findOne({ userId });
    
    const currentPrices = await priceService.getAllCurrentPrices();

    const portfolioStats = calculationService.calculatePortfolioValue(holdings, currentPrices);

    const holdingsWithDetails = holdings.map(holding => {
      const currentPrice = currentPrices[holding.metalType];
      return calculationService.calculateHoldingDetails(holding, currentPrice);
    });

    successResponse(res, {
      portfolioValue: portfolioStats.totalCurrentValue,
      totalInvested: portfolioStats.totalInvested,
      totalGainLoss: portfolioStats.totalGainLoss,
      totalGainLossPercent: portfolioStats.totalGainLossPercent,
      walletBalance: wallet.balance,
      holdings: holdingsWithDetails,
      currentPrices
    }, 'Portfolio retrieved successfully');

  } catch (error) {
    console.error('Get portfolio error:', error);
    errorResponse(res, 'Failed to get portfolio', 500);
  }
};