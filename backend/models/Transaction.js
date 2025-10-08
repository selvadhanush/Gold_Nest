const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['buy_gold', 'buy_silver', 'sell_gold', 'sell_silver', 'deposit', 'withdrawal']
  },
  metalType: {
    type: String,
    enum: ['gold', 'silver', null],
    lowercase: true
  },
  weightInGrams: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  pricePerGram: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed', 'cancelled'],
    default: 'completed'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  description: String,
  referenceId: String
});

transactionSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);