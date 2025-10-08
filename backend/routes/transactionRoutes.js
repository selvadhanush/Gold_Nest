const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/history', verifyToken, transactionController.getHistory);
router.get('/stats', verifyToken, transactionController.getStats);
router.get('/:id', verifyToken, transactionController.getById);

module.exports = router;