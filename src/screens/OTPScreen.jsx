import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, ChevronLeft, RefreshCw, Shield } from 'lucide-react';

export default function OTPScreen() {
  const { lang, setScreen, setMobile, setFarmer, t } = useApp();
  const [step, setStep] = useState('mobile'); // mobile | otp
  const [mobileVal, setMobileVal] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);

  const handleSendOTP = () => {
    if (mobileVal.length < 10) {
      setError(lang === 'kn' ? 'ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ' : 'Enter a valid mobile number');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setMobile(mobileVal);
      startResendTimer();
    }, 1500);
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer(t => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError(lang === 'kn' ? '6 ಅಂಕಿಯ OTP ನಮೂದಿಸಿ' : 'Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      setFarmer({ name: 'ರೈತ', mobile: mobileVal, district: 'Mandya', state: 'Karnataka' });
      setLoading(false);
      setScreen('gps');
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f5faed 0%, #e2f0ce 60%, #d4e8bc 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 24, position: 'relative',
    }}>
      {/* Back */}
      <button className="btn-ghost" style={{ position: 'absolute', top: 20, left: 16 }}
        onClick={() => step === 'otp' ? setStep('mobile') : setScreen('home')}>
        <ChevronLeft size={20}/> {t('back')}
      </button>

      <div className="glass-card" style={{ width: '100%', maxWidth: 420, padding: '40px 36px' }}>
        {/* Icon */}
        <div style={{
          width: 72, height: 72,
          background: 'linear-gradient(135deg, #718355, #4a5c33)',
          borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', boxShadow: '0 12px 32px rgba(74,92,51,0.3)',
        }}>
          {step === 'mobile' ? <Phone size={32} color="#e9f5db"/> : <Shield size={32} color="#e9f5db"/>}
        </div>

        <h2 style={{
          fontFamily: "'Noto Sans Kannada', 'Poppins', sans-serif",
          fontSize: 26, fontWeight: 800, color: '#2d3a1e',
          textAlign: 'center', marginBottom: 8,
        }}>
          {step === 'mobile'
            ? (lang === 'kn' ? 'ಪ್ರವೇಶಿಸಿ' : 'Sign In')
            : (lang === 'kn' ? 'OTP ಪರಿಶೀಲಿಸಿ' : 'Verify OTP')}
        </h2>

        <p style={{
          fontSize: 14, color: '#718355', textAlign: 'center', marginBottom: 32,
          fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
        }}>
          {step === 'mobile'
            ? (lang === 'kn' ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ' : 'Enter your mobile number')
            : `${t('otpSentTo')} +91 ${mobileVal}`}
        </p>

        {step === 'mobile' ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">{t('mobileNumber')}</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 15, fontWeight: 600, color: '#718355',
                }}>+91</span>
                <input
                  id="mobile-input"
                  type="tel"
                  maxLength={10}
                  className="input-field"
                  style={{ paddingLeft: 54 }}
                  placeholder="9876543210"
                  value={mobileVal}
                  onChange={e => setMobileVal(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                />
              </div>
            </div>
            {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>}
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
              onClick={handleSendOTP} disabled={loading}>
              {loading
                ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }}/> {t('loading')}</>
                : t('sendOTP')}
            </button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: 16 }}>
                {t('enterOTP')}
              </label>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
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
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKey(e, i)}
                  />
                ))}
              </div>
            </div>

            {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>}

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', marginBottom: 16 }}
              onClick={handleVerify} disabled={loading}>
              {loading
                ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }}/> {t('loading')}</>
                : t('verifyOTP')}
            </button>

            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
              disabled={resendTimer > 0}
              onClick={() => { setOtp(['','','','','','']); startResendTimer(); }}>
              {resendTimer > 0
                ? `${t('resendOTP')} (${resendTimer}s)`
                : t('resendOTP')}
            </button>
          </>
        )}

        <p style={{ fontSize: 11, color: '#9caf7a', textAlign: 'center', marginTop: 20 }}>
          {lang === 'kn'
            ? 'ಡೆಮೋ: ಯಾವುದೇ OTP ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ'
            : 'Demo: Any OTP will be accepted'}
        </p>
      </div>
    </div>
  );
}
