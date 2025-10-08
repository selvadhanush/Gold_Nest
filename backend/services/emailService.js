const nodemailer = require('nodemailer');
const config = require('../config/config');

// Check if email config exists
let transporter = null;

if (config.email.user && config.email.pass) {
  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: {
      user: config.email.user,
      pass: config.email.pass
    }
  });
} else {
  console.log('⚠️  Email service not configured - emails will not be sent');
}

exports.sendWelcomeEmail = async (email, fullName) => {
  if (!transporter) {
    console.log('Email service not configured, skipping welcome email');
    return;
  }
  
  try {
    await transporter.sendMail({
      from: `"Metals Trading Platform" <${config.email.user}>`,
      to: email,
      subject: 'Welcome to Metals Trading Platform',
      html: `
        <h1>Welcome ${fullName}!</h1>
        <p>Thank you for registering with us.</p>
        <p>Start trading gold and silver today!</p>
      `
    });
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

exports.sendTransactionEmail = async (email, fullName, transaction) => {
  if (!transporter) {
    console.log('Email service not configured, skipping transaction email');
    return;
  }
  
  try {
    await transporter.sendMail({
      from: `"Metals Trading Platform" <${config.email.user}>`,
      to: email,
      subject: 'Transaction Confirmation',
      html: `
        <h1>Transaction Successful</h1>
        <p>Dear ${fullName},</p>
        <p>Your ${transaction.type} transaction has been completed successfully.</p>
        <p>Amount: ₹${transaction.totalAmount}</p>
        <p>Date: ${new Date(transaction.timestamp).toLocaleString()}</p>
      `
    });
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

exports.sendKYCStatusEmail = async (email, fullName, status) => {
  if (!transporter) {
    console.log('Email service not configured, skipping KYC email');
    return;
  }
  
  try {
    await transporter.sendMail({
      from: `"Metals Trading Platform" <${config.email.user}>`,
      to: email,
      subject: 'KYC Status Update',
      html: `
        <h1>KYC Status Update</h1>
        <p>Dear ${fullName},</p>
        <p>Your KYC status has been updated to: <strong>${status}</strong></p>
        ${status === 'verified' ? '<p>You can now trade without restrictions!</p>' : ''}
      `
    });
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};