import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Leaf, Sprout, MapPin, Cpu } from 'lucide-react';

const features = [
  { icon: <MapPin size={22}/>, en: 'GPS Soil Detection', kn: 'GPS ಮಣ್ಣು ಪತ್ತೆ' },
  { icon: <Cpu size={22}/>, en: 'AI Crop Advice', kn: 'AI ಬೆಳೆ ಸಲಹೆ' },
  { icon: <Sprout size={22}/>, en: 'Nutrient Analysis', kn: 'ಪೋಷಕಾಂಶ ವಿಶ್ಲೇಷಣೆ' },
  { icon: <Leaf size={22}/>, en: 'Soil Recovery', kn: 'ಮಣ್ಣು ಚೇತರಿಕೆ' },
];

export default function HomeScreen() {
  const { lang, setLang, setScreen, t } = useApp();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f5faed 0%, #e8f4d6 40%, #d9ecc0 70%, #cce4ae 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background art */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(113,131,85,0.12) 0%, transparent 70%)',
        }}/>
        <div style={{
          position: 'absolute', bottom: -50, left: -80,
          width: 350, height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(151,169,124,0.15) 0%, transparent 70%)',
        }}/>
        {/* Floating icons */}
        {['🌾','🌿','🍃','🌱'].map((icon, i) => (
          <div key={i} style={{
            position: 'absolute',
            fontSize: 28 + i * 6,
            opacity: 0.08,
            top: `${15 + i * 20}%`,
            left: i % 2 === 0 ? `${5 + i * 3}%` : undefined,
            right: i % 2 !== 0 ? `${3 + i * 5}%` : undefined,
            animation: `float ${3 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}>{icon}</div>
        ))}
      </div>

      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 28px',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #4a5c33, #718355)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={20} color="#e9f5db"/>
          </div>
          <span style={{
            fontFamily: "'Noto Sans Kannada', 'Poppins', sans-serif",
            fontSize: 20, fontWeight: 800, color: '#2d3a1e',
          }}>ಭೂಮಿ</span>
        </div>
        <div className="lang-toggle">
          <button
            className={lang === 'kn' ? 'active-lang' : 'inactive-lang'}
            onClick={() => setLang('kn')}
          >ಕನ್ನಡ</button>
          <button
            className={lang === 'en' ? 'active-lang' : 'inactive-lang'}
            onClick={() => setLang('en')}
          >English</button>
        </div>
      </div>

      {/* Hero section */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '20px 28px 40px',
        textAlign: 'center', position: 'relative', zIndex: 5,
      }}>
        {/* Big logo */}
        <div style={{
          width: 100, height: 100,
          background: 'linear-gradient(135deg, #718355, #4a5c33)',
          borderRadius: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 28,
          boxShadow: '0 20px 60px rgba(74,92,51,0.3)',
          animation: 'float 4s ease-in-out infinite',
        }}>
          <Leaf size={50} color="#e9f5db"/>
        </div>

        <div className="badge badge-green" style={{ marginBottom: 16, fontSize: 13 }}>
          🌍 Karnataka • {lang === 'kn' ? 'ಕರ್ನಾಟಕ ಕೃಷಿ ವೇದಿಕೆ' : 'Agriculture Platform'}
        </div>

        <h1 style={{
          fontFamily: "'Noto Sans Kannada', 'Poppins', sans-serif",
          fontSize: lang === 'kn' ? 42 : 46,
          fontWeight: 900,
          color: '#2d3a1e',
          lineHeight: 1.1,
          marginBottom: 16,
          maxWidth: 600,
          animation: 'fadeInUp 0.7s ease forwards',
        }}>
          {lang === 'kn'
            ? 'ನಿಮ್ಮ ಮಣ್ಣನ್ನು ಅರ್ಥ ಮಾಡಿಕೊಳ್ಳಿ'
            : 'Understand Your Soil.\nGrow Better.'}
        </h1>

        <p style={{
          fontSize: 16,
          color: '#4a5c33',
          lineHeight: 1.7,
          maxWidth: 480,
          marginBottom: 40,
          fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
          animation: 'fadeInUp 0.7s ease 0.15s forwards',
          opacity: 0,
        }}>
          {lang === 'kn'
            ? 'GPS ಆಧಾರಿತ ಮಣ್ಣು ಪತ್ತೆ, AI ಬೆಳೆ ಶಿಫಾರಸು ಮತ್ತು ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಟ್ರ್ಯಾಕಿಂಗ್ — ಕನ್ನಡದಲ್ಲಿ.'
            : 'GPS-powered soil detection, AI crop recommendations, and soil health tracking — built for Karnataka farmers.'}
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: 48,
          animation: 'fadeInUp 0.7s ease 0.3s forwards',
          opacity: 0,
        }}>
          <button className="btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}
            onClick={() => setScreen('otp')}>
            <Leaf size={18}/>
            {lang === 'kn' ? 'ಪ್ರಾರಂಭಿಸಿ' : 'Get Started'}
          </button>
          <button className="btn-secondary" style={{ fontSize: 15 }}
            onClick={() => { setScreen('app'); }}>
            {lang === 'kn' ? 'ಡೆಮೋ ನೋಡಿ' : 'View Demo'}
          </button>
        </div>

        {/* Feature cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12, width: '100%', maxWidth: 480,
          animation: 'fadeInUp 0.7s ease 0.45s forwards',
          opacity: 0,
        }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card" style={{
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(113,131,85,0.15), rgba(74,92,51,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#718355', flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <span style={{
                fontSize: 13, fontWeight: 600, color: '#4a5c33',
                fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
              }}>
                {lang === 'kn' ? f.kn : f.en}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <p style={{
        textAlign: 'center', fontSize: 12, color: '#97a97c',
        padding: '0 0 24px',
        fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
        position: 'relative', zIndex: 5,
      }}>
        {lang === 'kn'
          ? '🔒 ನಿಮ್ಮ ಡೇಟಾ ಸುರಕ್ಷಿತ ಮತ್ತು ಖಾಸಗಿ'
          : '🔒 Your data is secure and private'}
      </p>
    </div>
  );
}
