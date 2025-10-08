const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  metalType: {
    type: String,
    required: true,
    enum: ['gold', 'silver'],
    lowercase: true
  },
  purity: {
    type: String,
    required: true
  },
  pricePerGram: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  changePercent: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

priceHistorySchema.index({ metalType: 1, timestamp: -1 });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);