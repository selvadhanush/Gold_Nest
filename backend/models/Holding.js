const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  weightInGrams: {
    type: Number,
    required: true,
    min: [0, 'Weight cannot be negative']
  },
  averagePurchasePrice: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  totalInvestedAmount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

holdingSchema.index({ userId: 1, metalType: 1 });

holdingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Holding', holdingSchema);