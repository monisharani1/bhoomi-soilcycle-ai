// ============================================================
//  Bhoomi — Auth Routes
//  POST /api/auth/send-otp
//  POST /api/auth/verify-otp
// ============================================================

const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../services/otpService');

/**
 * POST /api/auth/send-otp
 * Body: { phone: "9876543210" }
 */
router.post('/auth/send-otp', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  const cleanPhone = phone.toString().replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    return res.status(400).json({
      success: false,
      message: 'Enter a valid 10-digit Indian mobile number.',
    });
  }

  try {
    const result = await sendOTP(cleanPhone);
    if (!result.success) {
      return res.status(500).json(result);
    }

    const response = {
      success: true,
      message: `OTP sent to +91${cleanPhone}`,
    };

    // Only expose OTP in response during dev mode (no Twilio configured)
    if (result.dev) {
      response.dev_otp = result.otp;
      response.dev_note = 'Development mode — OTP shown here. Configure Twilio for real SMS.';
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error('Send OTP error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send OTP. Try again.' });
  }
});

/**
 * POST /api/auth/verify-otp
 * Body: { phone: "9876543210", otp: "123456" }
 */
router.post('/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone and OTP are required.' });
  }

  const cleanPhone = phone.toString().replace(/\D/g, '');
  const result = verifyOTP(cleanPhone, otp.toString());

  if (!result.success) {
    return res.status(400).json(result);
  }

  // Generate a simple session token
  const token = Buffer.from(`${cleanPhone}:${Date.now()}:bhoomi`).toString('base64');

  return res.status(200).json({
    success: true,
    message: 'Login successful! Welcome to Bhoomi.',
    token,
    farmer: {
      phone: cleanPhone,
      name: `Farmer_${cleanPhone.slice(-4)}`,
      registered_at: new Date().toISOString(),
    },
  });
});

module.exports = router;
