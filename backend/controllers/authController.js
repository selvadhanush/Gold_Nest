const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { hashPassword, comparePassword } = require('../utils/encryption');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');
const emailService = require('../services/emailService');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    await Wallet.create({
      userId: user._id,
      balance: 0
    });

    const token = generateToken(user._id);

    emailService.sendWelcomeEmail(email, fullName).catch(console.error);

    successResponse(res, {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        kycVerified: user.kycVerified
      }
    }, 'Registration successful', 201);

  } catch (error) {
    console.error('Registration error:', error);
    errorResponse(res, 'Registration failed', 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isMatch = await comparePassword(password, user.password);
    
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken(user._id);

    successResponse(res, {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        kycVerified: user.kycVerified,
        kycStatus: user.kycStatus
      }
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    errorResponse(res, 'Login failed', 500);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, { user }, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    errorResponse(res, 'Failed to get profile', 500);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, address, dateOfBirth } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;

    await user.save();

    successResponse(res, { user }, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    errorResponse(res, 'Failed to update profile', 500);
  }
};

exports.logout = async (req, res) => {
  try {
    successResponse(res, null, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    errorResponse(res, 'Logout failed', 500);
  }
};