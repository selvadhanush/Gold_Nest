const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/kyc/submit', verifyToken, userController.uploadMiddleware, userController.submitKYC);
router.get('/kyc/status', verifyToken, userController.getKYCStatus);
router.put('/kyc/verify', verifyToken, userController.verifyKYC);

module.exports = router;