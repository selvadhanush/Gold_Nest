const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

router.get('/current', priceController.getCurrentPrices);
router.get('/gold', priceController.getGoldPrice);
router.get('/silver', priceController.getSilverPrice);
router.get('/history', priceController.getPriceHistory);

module.exports = router;