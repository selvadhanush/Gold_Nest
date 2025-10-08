const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');
const emailService = require('../services/emailService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = './uploads/kyc';
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDFs are allowed'));
  }
}).fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 }
]);

exports.uploadMiddleware = upload;

exports.submitKYC = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (user.kycStatus === 'verified') {
      return errorResponse(res, 'KYC already verified', 400);
    }

    const documents = [];

    if (req.files.idProof) {
      documents.push({
        type: 'idProof',
        url: req.files.idProof[0].path,
        uploadedAt: new Date()
      });
    }

    if (req.files.addressProof) {
      documents.push({
        type: 'addressProof',
        url: req.files.addressProof[0].path,
        uploadedAt: new Date()
      });
    }

    user.kycDocuments = documents;
    user.kycStatus = 'submitted';
    await user.save();

    emailService.sendKYCStatusEmail(user.email, user.fullName, 'submitted').catch(console.error);

    successResponse(res, { 
      kycStatus: user.kycStatus,
      documents: user.kycDocuments 
    }, 'KYC documents submitted successfully');

  } catch (error) {
    console.error('KYC submission error:', error);
    errorResponse(res, 'Failed to submit KYC', 500);
  }
};

exports.getKYCStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('kycStatus kycVerified kycDocuments');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, {
      kycStatus: user.kycStatus,
      kycVerified: user.kycVerified,
      documentsSubmitted: user.kycDocuments.length > 0
    }, 'KYC status retrieved successfully');

  } catch (error) {
    console.error('Get KYC status error:', error);
    errorResponse(res, 'Failed to get KYC status', 500);
  }
};

exports.verifyKYC = async (req, res) => {
  try {
    const { userId, status } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    user.kycStatus = status;
    user.kycVerified = status === 'verified';
    await user.save();

    emailService.sendKYCStatusEmail(user.email, user.fullName, status).catch(console.error);

    successResponse(res, { 
      userId: user._id,
      kycStatus: user.kycStatus,
      kycVerified: user.kycVerified
    }, 'KYC status updated successfully');

  } catch (error) {
    console.error('Verify KYC error:', error);
    errorResponse(res, 'Failed to verify KYC', 500);
  }
};