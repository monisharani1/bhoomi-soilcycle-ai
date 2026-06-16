// ============================================================
//  Bhoomi — OTP Service
//  Sends real SMS via Twilio. Falls back to dev-mode console log.
// ============================================================

const otpStore = new Map(); // phone → { otp, expiry, attempts }

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP to an Indian mobile number.
 * If Twilio env vars are set → real SMS.
 * Otherwise → dev mode (OTP logged to console + returned in response).
 */
async function sendOTP(phone) {
  // Clean and validate
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    return { success: false, message: 'Invalid phone number' };
  }

  const otp = generateOTP();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(cleanPhone, { otp, expiry, attempts: 0 });

  const hasTwilio =
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER;

  if (hasTwilio) {
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `Your Bhoomi OTP is: ${otp}. Valid for 5 minutes. Do not share with anyone. - Bhoomi SoilCycle AI`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${cleanPhone}`,
      });
      console.log(`✅ OTP sent via Twilio to +91${cleanPhone}`);
      return { success: true, dev: false };
    } catch (err) {
      console.error('❌ Twilio SMS failed:', err.message);
      // Fall through to dev mode
    }
  }

  // ── Dev mode ─────────────────────────────────────────────
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`🔐 [DEV OTP] Phone: +91${cleanPhone}  →  OTP: ${otp}`);
  console.log(`   Expires in 5 minutes`);
  console.log(`${'─'.repeat(50)}\n`);

  return {
    success: true,
    dev: true,
    otp, // Returned to frontend only in dev mode for testing
    note: 'Development mode: Configure TWILIO_* env vars for real SMS',
  };
}

/**
 * Verify OTP for a phone number.
 */
function verifyOTP(phone, enteredOtp) {
  const cleanPhone = phone.replace(/\D/g, '');
  const stored = otpStore.get(cleanPhone);

  if (!stored) {
    return { success: false, message: 'No OTP found for this number. Please request a new OTP.' };
  }

  if (Date.now() > stored.expiry) {
    otpStore.delete(cleanPhone);
    return { success: false, message: 'OTP has expired. Please request a new one.' };
  }

  if (stored.attempts >= 3) {
    otpStore.delete(cleanPhone);
    return { success: false, message: 'Too many wrong attempts. Please request a new OTP.' };
  }

  if (stored.otp !== enteredOtp.toString().trim()) {
    stored.attempts += 1;
    const remaining = 3 - stored.attempts;
    return {
      success: false,
      message: `Incorrect OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
    };
  }

  // ✅ Correct OTP
  otpStore.delete(cleanPhone);
  return { success: true };
}

module.exports = { sendOTP, verifyOTP };
