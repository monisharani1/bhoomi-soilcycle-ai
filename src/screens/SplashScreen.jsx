import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const BHOOMI_LOGO = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    <circle cx="40" cy="40" r="38" fill="url(#splashGrad)" opacity="0.2"/>
    <ellipse cx="40" cy="52" rx="28" ry="12" fill="url(#earthGrad)" opacity="0.9"/>
    <path d="M22 40 Q40 10 58 40" stroke="#cfe1b9" strokeWidth="2.5" fill="none" opacity="0.7"/>
    <path d="M26 44 Q40 18 54 44" stroke="#e9f5db" strokeWidth="2" fill="none" opacity="0.5"/>
    <circle cx="40" cy="32" r="14" fill="url(#leafGrad)"/>
    <path d="M34 35 Q40 22 46 35 Q40 38 34 35Z" fill="#e9f5db" opacity="0.8"/>
    <path d="M40 22 L40 36" stroke="#cfe1b9" strokeWidth="1.5"/>
    <defs>
      <linearGradient id="splashGrad" x1="0" y1="0" x2="80" y2="80">
        <stop offset="0%" stopColor="#e9f5db"/>
        <stop offset="100%" stopColor="#718355"/>
      </linearGradient>
      <linearGradient id="earthGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#97a97c"/>
        <stop offset="100%" stopColor="#4a5c33"/>
      </linearGradient>
      <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#b5c99a"/>
        <stop offset="100%" stopColor="#718355"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function SplashScreen() {
  const { setScreen, lang } = useApp();
  const [hiding, setHiding] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 50);
    const timer = setTimeout(() => {
      setHiding(true);
      setTimeout(() => setScreen('home'), 800);
    }, 3200);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [setScreen]);

  return (
    <div className={`splash-screen ${hiding ? 'hiding' : ''}`}>
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          borderRadius: '50%',
          background: `rgba(233,245,219,${Math.random() * 0.4 + 0.1})`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
        }} />
      ))}

      {/* Logo */}
      <div style={{ width: 120, height: 120, marginBottom: 24, animation: 'float 3s ease-in-out infinite' }}>
        <BHOOMI_LOGO />
      </div>

      {/* Name */}
      <h1 style={{
        fontFamily: "'Noto Sans Kannada', 'Poppins', sans-serif",
        fontSize: 52,
        fontWeight: 800,
        color: '#e9f5db',
        letterSpacing: '-1px',
        lineHeight: 1,
        marginBottom: 8,
        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        animation: 'fadeInUp 0.8s ease 0.2s forwards',
        opacity: 0,
      }}>
        ಭೂಮಿ
      </h1>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 15,
        color: '#b5c99a',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        marginBottom: 4,
        animation: 'fadeInUp 0.8s ease 0.4s forwards',
        opacity: 0,
      }}>BHOOMI</p>
      <p style={{
        fontFamily: "'Noto Sans Kannada', sans-serif",
        fontSize: 14,
        color: '#97a97c',
        marginBottom: 48,
        animation: 'fadeInUp 0.8s ease 0.6s forwards',
        opacity: 0,
      }}>
        ಸ್ಮಾರ್ಟ್ ಮಣ್ಣು ಬುದ್ಧಿಮತ್ತೆ • Smart Soil Intelligence
      </p>

      {/* Progress bar */}
      <div style={{
        width: 200,
        height: 3,
        background: 'rgba(255,255,255,0.15)',
        borderRadius: 2,
        overflow: 'hidden',
        animation: 'fadeIn 0.5s ease 0.5s forwards',
        opacity: 0,
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #97a97c, #e9f5db)',
          borderRadius: 2,
          transition: 'width 0.05s linear',
        }} />
      </div>

      {/* Bottom text */}
      <p style={{
        position: 'absolute',
        bottom: 40,
        fontSize: 12,
        color: 'rgba(207,225,185,0.5)',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '1px',
      }}>
        Karnataka Agriculture Platform
      </p>
    </div>
  );
}
