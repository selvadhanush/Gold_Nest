const Transaction = require('../models/Transaction');
const calculationService = require('../services/calculationService');
const { successResponse, errorResponse } = require('../utils/response');

exports.getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const userId = req.user._id;

    const query = { userId };
    if (type) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Transaction.countDocuments(query);

    successResponse(res, {
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Transaction history retrieved successfully');

  } catch (error) {
    console.error('Get transaction history error:', error);
    errorResponse(res, 'Failed to get transaction history', 500);
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
      return errorResponse(res, 'Transaction not found', 404);
    }

    successResponse(res, { transaction }, 'Transaction retrieved successfully');

  } catch (error) {
    console.error('Get transaction error:', error);
    errorResponse(res, 'Failed to get transaction', 500);
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId });

    const stats = calculationService.calculateTransactionStats(transactions);

    const recentTransactions = await Transaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(5);

    successResponse(res, {
      stats,
      recentTransactions
    }, 'Transaction stats retrieved successfully');

  } catch (error) {
    console.error('Get transaction stats error:', error);
    errorResponse(res, 'Failed to get transaction stats', 500);
  }
};