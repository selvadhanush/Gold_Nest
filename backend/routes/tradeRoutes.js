const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const { verifyToken, requireKYC } = require('../middleware/authMiddleware');
const { validateTrade } = require('../middleware/validator');

router.post('/buy', verifyToken, requireKYC, validateTrade, tradeController.buyMetal);
router.post('/sell', verifyToken, requireKYC, validateTrade, tradeController.sellMetal);
router.get('/holdings', verifyToken, tradeController.getHoldings);
router.get('/portfolio', verifyToken, tradeController.getPortfolio);

module.exports = router;