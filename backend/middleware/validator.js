const { body, validationResult } = require('express-validator');

exports.validateRegistration = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateTrade = [
  body('metalType').isIn(['gold', 'silver']).withMessage('Invalid metal type'),
  body('amountInRupees').optional().isFloat({ min: 1 }).withMessage('Amount must be positive'),
  body('weightInGrams').optional().isFloat({ min: 0.001 }).withMessage('Weight must be positive'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    if (!req.body.amountInRupees && !req.body.weightInGrams) {
      return res.status(400).json({
        success: false,
        message: 'Either amount or weight must be provided'
      });
    }
    next();
  }
];

exports.validateDeposit = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];