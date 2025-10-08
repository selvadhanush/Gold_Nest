const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateDeposit } = require('../middleware/validator');

router.get('/balance', verifyToken, walletController.getBalance);
router.post('/deposit', verifyToken, validateDeposit, walletController.deposit);
router.post('/withdraw', verifyToken, validateDeposit, walletController.withdraw);

module.exports = router;