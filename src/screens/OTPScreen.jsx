import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Shield, RefreshCw, ChevronLeft, CheckCircle, Leaf } from 'lucide-react';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function OTPScreen() {
  const { lang, setScreen, setMobile, setFarmer, t } = useApp();
  const [step, setStep] = useState('phone'); // phone | otp | success
  const [phoneVal, setPhoneVal] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [devOtp, setDevOtp] = useState(''); // shown in dev mode
  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startResendTimer = () => {
    setResendTimer(30);
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Send OTP ──────────────────────────────────────────────
  const handleSendOTP = async () => {
    const clean = phoneVal.replace(/\D/g, '');
    if (clean.length !== 10) {
      setError(lang === 'kn' ? 'ಮಾನ್ಯ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ' : 'Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    setDevOtp('');

    try {
      const res = await fetch(`${BACKEND}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Failed to send OTP');
        setLoading(false);
        return;
      }

      setMobile(clean);
      if (data.dev_otp) setDevOtp(data.dev_otp); // dev mode
      setStep('otp');
      startResendTimer();
    } catch {
      setError('Cannot reach server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handlers ────────────────────────────────────
  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  // ── Verify OTP ────────────────────────────────────────────
  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError(lang === 'kn' ? '6 ಅಂಕಿಯ OTP ನಮೂದಿಸಿ' : 'Enter the 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneVal.replace(/\D/g, ''), otp: code }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Incorrect OTP');
        setLoading(false);
        return;
      }

      // ✅ Auth success
      setFarmer({ ...data.farmer, token: data.token });
      setStep('success');
      setTimeout(() => setScreen('gps'), 1600);
    } catch {
      setError('Cannot reach server. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setDevOtp('');
    setError('');
    await handleSendOTP();
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f5faed 0%, #e2f0ce 55%, #c8e2a8 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 24, position: 'relative',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'fixed', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(113,131,85,0.08)', pointerEvents: 'none' }}/>
      <div style={{ position: 'fixed', bottom: -80, left: -40, width: 250, height: 250, borderRadius: '50%', background: 'rgba(74,92,51,0.06)', pointerEvents: 'none' }}/>

      {/* Back button */}
      {step !== 'success' && (
        <button className="btn-ghost" style={{ position: 'absolute', top: 20, left: 16 }}
          onClick={() => step === 'otp' ? (setStep('phone'), setDevOtp('')) : setScreen('home')}>
          <ChevronLeft size={18}/> {t('back')}
        </button>
      )}

      <div className="glass-card" style={{ width: '100%', maxWidth: 420, padding: '44px 36px', position: 'relative' }}>

        {/* Top icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          {step === 'success' ? (
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(46,125,50,0.4)',
              animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}>
              <CheckCircle size={38} color="white"/>
            </div>
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: 22,
              background: 'linear-gradient(135deg, #718355, #4a5c33)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(74,92,51,0.3)',
            }}>
              {step === 'phone' ? <Phone size={34} color="#e9f5db"/> : <Shield size={34} color="#e9f5db"/>}
            </div>
          )}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Noto Sans Kannada', 'Poppins', sans-serif",
          fontSize: 26, fontWeight: 800, color: '#2d3a1e',
          textAlign: 'center', marginBottom: 8,
        }}>
          {step === 'success'
            ? (lang === 'kn' ? 'ಸ್ವಾಗತ! 🙏' : 'Welcome! 🙏')
            : step === 'phone'
              ? (lang === 'kn' ? 'ಭೂಮಿ ಅಪ್ಲಿಕೇಶನ್‌ಗೆ ಪ್ರವೇಶಿಸಿ' : 'Sign In to Bhoomi')
              : (lang === 'kn' ? 'OTP ಪರಿಶೀಲಿಸಿ' : 'Verify OTP')}
        </h2>

        <p style={{
          fontSize: 14, color: '#718355', textAlign: 'center', marginBottom: 32,
          fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif", lineHeight: 1.6,
        }}>
          {step === 'success'
            ? (lang === 'kn' ? 'ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ!' : 'You are now logged in!')
            : step === 'phone'
              ? (lang === 'kn' ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ' : 'Enter your mobile number to receive OTP')
              : (lang === 'kn' ? `+91 ${phoneVal} ಗೆ OTP ಕಳುಹಿಸಲಾಗಿದೆ` : `OTP sent to +91 ${phoneVal}`)}
        </p>

        {/* ── Phone Step ── */}
        {step === 'phone' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">{t('mobileNumber')}</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 15, fontWeight: 700, color: '#718355',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  🇮🇳 +91
                </div>
                <input
                  id="phone-input"
                  type="tel"
                  maxLength={10}
                  className="input-field"
                  style={{ paddingLeft: 80, fontSize: 18, letterSpacing: 2, fontWeight: 600 }}
                  placeholder="9876543210"
                  value={phoneVal}
                  onChange={e => setPhoneVal(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 16,
              }}>
                <p style={{ color: '#c0392b', fontSize: 13, textAlign: 'center' }}>⚠️ {error}</p>
              </div>
            )}

            <button className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 16 }}
              onClick={handleSendOTP} disabled={loading}>
              {loading
                ? <><RefreshCw size={16} style={{ animation: 'spin-slow 0.8s linear infinite' }}/> Sending OTP...</>
                : <>{t('sendOTP')} →</>}
            </button>

            <p style={{ fontSize: 12, color: '#97a97c', textAlign: 'center', marginTop: 20 }}>
              🔒 {lang === 'kn' ? 'ನಿಮ್ಮ ಡೇಟಾ ಸುರಕ್ಷಿತ ಮತ್ತು ಗೌಪ್ಯ' : 'Your data is secure and private'}
            </p>
          </>
        )}

        {/* ── OTP Step ── */}
        {step === 'otp' && (
          <>
            {/* Dev mode OTP display */}
            {devOtp && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(76,175,80,0.12), rgba(46,125,50,0.08))',
                border: '1.5px solid rgba(76,175,80,0.4)',
                borderRadius: 14, padding: '14px 18px', marginBottom: 20,
                textAlign: 'center',
              }}>
                <p style={{ fontSize: 11, color: '#2e7d32', fontWeight: 600, marginBottom: 6 }}>
                  🟡 DEV MODE — Real SMS not configured
                </p>
                <p style={{ fontSize: 13, color: '#388e3c', marginBottom: 4 }}>Your OTP is:</p>
                <p style={{ fontSize: 32, fontWeight: 900, color: '#1b5e20', letterSpacing: 8, fontFamily: 'monospace' }}>
                  {devOtp}
                </p>
                <p style={{ fontSize: 11, color: '#4caf50', marginTop: 4 }}>
                  Configure Twilio in server/.env for real SMS
                </p>
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: 16 }}>
                {t('enterOTP')}
              </label>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }} onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="otp-input"
                    value={digit}
                    style={{
                      width: 46, height: 54, textAlign: 'center',
                      fontSize: 22, fontWeight: 800, borderRadius: 12,
                      border: digit ? '2px solid #718355' : '2px solid #cfe1b9',
                      background: digit ? 'rgba(113,131,85,0.08)' : 'white',
                      outline: 'none', transition: 'all 0.2s',
                      fontFamily: 'monospace',
                    }}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKey(e, i)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 16,
              }}>
                <p style={{ color: '#c0392b', fontSize: 13, textAlign: 'center' }}>⚠️ {error}</p>
              </div>
            )}

            <button className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', marginBottom: 14, fontSize: 16 }}
              onClick={handleVerify} disabled={loading || otp.join('').length < 6}>
              {loading
                ? <><RefreshCw size={16} style={{ animation: 'spin-slow 0.8s linear infinite' }}/> Verifying...</>
                : <><Shield size={16}/> {t('verifyOTP')}</>}
            </button>

            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
              disabled={resendTimer > 0}
              onClick={handleResend}>
              {resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : '↩ Resend OTP'}
            </button>
          </>
        )}

        {/* ── Success Step ── */}
        {step === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)',
              borderRadius: 14, padding: '20px',
            }}>
              <p style={{ fontSize: 15, color: '#2e7d32', fontWeight: 600, marginBottom: 8 }}>
                ✅ +91 {phoneVal}
              </p>
              <p style={{ fontSize: 13, color: '#388e3c' }}>
                {lang === 'kn' ? 'ಈಗ GPS ಮ್ಯಾಪ್‌ಗೆ ಹೋಗಲಾಗುತ್ತಿದೆ...' : 'Redirecting to GPS Map...'}
              </p>
            </div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 8 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%', background: '#718355',
                  animation: `bounce 1s ease ${i * 0.2}s infinite`,
                }}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Powered by Bhoomi */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 24, opacity: 0.6 }}>
        <Leaf size={14} color="#718355"/>
        <p style={{ fontSize: 12, color: '#718355', fontFamily: "'Inter', sans-serif" }}>
          Bhoomi SoilCycle AI
        </p>
      </div>
    </div>
  );
}
