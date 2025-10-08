const priceService = require('../services/priceService');
const { successResponse, errorResponse } = require('../utils/response');

exports.getCurrentPrices = async (req, res) => {
  try {
    const prices = await priceService.getAllCurrentPrices();

    successResponse(res, { prices }, 'Current prices retrieved successfully');

  } catch (error) {
    console.error('Get current prices error:', error);
    errorResponse(res, 'Failed to get current prices', 500);
  }
};

exports.getGoldPrice = async (req, res) => {
  try {
    const price = await priceService.getCurrentPrice('gold');

    successResponse(res, { price }, 'Gold price retrieved successfully');

  } catch (error) {
    console.error('Get gold price error:', error);
    errorResponse(res, 'Failed to get gold price', 500);
  }
};

exports.getSilverPrice = async (req, res) => {
  try {
    const price = await priceService.getCurrentPrice('silver');

    successResponse(res, { price }, 'Silver price retrieved successfully');

  } catch (error) {
    console.error('Get silver price error:', error);
    errorResponse(res, 'Failed to get silver price', 500);
  }
};

exports.getPriceHistory = async (req, res) => {
  try {
    const { metalType, days } = req.query;

    if (!metalType) {
      return errorResponse(res, 'Metal type is required', 400);
    }

    const daysCount = parseInt(days) || 7;

    let history = await priceService.getPriceHistory(metalType, daysCount);

    if (history.length === 0) {
      history = await priceService.generateMockHistory(metalType, daysCount);
    }

    successResponse(res, { 
      metalType,
      days: daysCount,
      history 
    }, 'Price history retrieved successfully');

  } catch (error) {
    console.error('Get price history error:', error);
    errorResponse(res, 'Failed to get price history', 500);
  }
};