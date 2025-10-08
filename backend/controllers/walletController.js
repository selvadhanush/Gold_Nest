const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const { successResponse, errorResponse } = require('../utils/response');
const emailService = require('../services/emailService');

exports.getBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      return errorResponse(res, 'Wallet not found', 404);
    }

    successResponse(res, {
      balance: wallet.balance,
      currency: wallet.currency
    }, 'Balance retrieved successfully');

  } catch (error) {
    console.error('Get balance error:', error);
    errorResponse(res, 'Failed to get balance', 500);
  }
};

exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return errorResponse(res, 'Invalid amount', 400);
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      return errorResponse(res, 'Wallet not found', 404);
    }

    wallet.balance += amount;
    await wallet.save();

    const transaction = await Transaction.create({
      userId: req.user._id,
      type: 'deposit',
      totalAmount: amount,
      status: 'completed',
      timestamp: new Date(),
      description: 'Wallet deposit'
    });

    emailService.sendTransactionEmail(
      req.user.email,
      req.user.fullName,
      transaction
    ).catch(console.error);

    successResponse(res, {
      balance: wallet.balance,
      transaction
    }, 'Deposit successful', 201);

  } catch (error) {
    console.error('Deposit error:', error);
    errorResponse(res, 'Deposit failed', 500);
  }
};

exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return errorResponse(res, 'Invalid amount', 400);
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      return errorResponse(res, 'Wallet not found', 404);
    }

    if (wallet.balance < amount) {
      return errorResponse(res, 'Insufficient balance', 400);
    }

    wallet.balance -= amount;
    await wallet.save();

    const transaction = await Transaction.create({
      userId: req.user._id,
      type: 'withdrawal',
      totalAmount: amount,
      status: 'completed',
      timestamp: new Date(),
      description: 'Wallet withdrawal'
    });

    emailService.sendTransactionEmail(
      req.user.email,
      req.user.fullName,
      transaction
    ).catch(console.error);

    successResponse(res, {
      balance: wallet.balance,
      transaction
    }, 'Withdrawal successful', 201);

  } catch (error) {
    console.error('Withdrawal error:', error);
    errorResponse(res, 'Withdrawal failed', 500);
  }
};