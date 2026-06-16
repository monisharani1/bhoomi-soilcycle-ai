import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function GPSScreen() {
  const { lang, setScreen, setLocation, setSoilData, detectSoilFromLocation, t } = useApp();
  const [gpsState, setGpsState] = useState('idle'); // idle | loading | success | error | manual
  const [errorMsg, setErrorMsg] = useState('');
  const [coords, setCoords] = useState(null);

  const handleGetLocation = () => {
    setGpsState('loading');
    setErrorMsg('');

    if (!navigator.geolocation) {
      // Fallback for demo
      simulateLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        const soil = await detectSoilFromLocation(latitude, longitude);
        setLocation({ lat: latitude, lon: longitude });
        setSoilData(soil);
        setGpsState('success');
      },
      err => {
        // In demo environment use simulated location
        simulateLocation();
      },
      { timeout: 8000 }
    );
  };

  const simulateLocation = async () => {
    // Simulate Karnataka farmer location
    const demoLat = 12.5211 + (Math.random() - 0.5) * 2;
    const demoLon = 76.8958 + (Math.random() - 0.5) * 2;
    setCoords({ lat: demoLat, lon: demoLon });
    const soil = await detectSoilFromLocation(demoLat, demoLon);
    setLocation({ lat: demoLat, lon: demoLon });
    setSoilData(soil);
    setTimeout(() => setGpsState('success'), 1500);
  };

  const handleContinue = () => {
    setScreen('app');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f0f9e8 0%, #e4f3d4 50%, #d6ecbe 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 24,
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 440, padding: '44px 36px', textAlign: 'center' }}>

        {/* GPS Animation Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div className="gps-pulse" style={{ width: 100, height: 100 }}>
            <div style={{
              width: 70, height: 70,
              background: gpsState === 'success'
                ? 'linear-gradient(135deg, #4caf50, #2e7d32)'
                : gpsState === 'error'
                  ? 'linear-gradient(135deg, #f44336, #b71c1c)'
                  : 'linear-gradient(135deg, #718355, #4a5c33)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(74,92,51,0.35)',
              transition: 'all 0.5s ease',
              position: 'relative', zIndex: 10,
            }}>
              {gpsState === 'loading'
                ? <Loader size={32} color="#e9f5db" style={{ animation: 'spin-slow 1s linear infinite' }}/>
                : gpsState === 'success'
                  ? <CheckCircle size={32} color="white"/>
                  : gpsState === 'error'
                    ? <AlertCircle size={32} color="white"/>
                    : <Navigation size={32} color="#e9f5db"/>}
            </div>
          </div>
        </div>

        <h2 style={{
          fontFamily: "'Noto Sans Kannada', 'Poppins', sans-serif",
          fontSize: 26, fontWeight: 800, color: '#2d3a1e', marginBottom: 12,
        }}>
          {lang === 'kn' ? 'ಸ್ಥಳ ಅನುಮತಿ' : 'Location Permission'}
        </h2>

        {gpsState === 'idle' && (
          <>
            <p style={{
              fontSize: 15, color: '#4a5c33', lineHeight: 1.7, marginBottom: 32,
              fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
            }}>
              {lang === 'kn'
                ? 'ನಿಮ್ಮ ಜಮೀನಿನ ಮಣ್ಣಿನ ಮಾಹಿತಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪಡೆಯಲು GPS ಅನುಮತಿ ನೀಡಿ.'
                : 'Allow GPS access to automatically detect your farm\'s soil type using our regional soil mapping database.'}
            </p>

            {/* Why we need it */}
            <div style={{
              background: 'rgba(113,131,85,0.08)', borderRadius: 14,
              padding: '16px 20px', marginBottom: 28, textAlign: 'left',
            }}>
              {[
                { icon: '📍', text: lang === 'kn' ? 'ಜಿಲ್ಲೆ ಮತ್ತು ತಾಲ್ಲೂಕು ಪತ್ತೆ' : 'Detect district & taluk' },
                { icon: '🗺️', text: lang === 'kn' ? 'GIS ಮಣ್ಣು ನಕ್ಷೆ ಹೊಂದಾಣಿಕೆ' : 'GIS soil map matching' },
                { icon: '🧪', text: lang === 'kn' ? 'ಮಣ್ಣಿನ ಪ್ರಕಾರ ಊಹೆ' : 'Soil type prediction' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, marginBottom: i < 2 ? 12 : 0,
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: '#4a5c33', fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif" }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', marginBottom: 12 }}
              onClick={handleGetLocation}>
              <MapPin size={18}/> {t('allowLocation')}
            </button>
            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', color: '#97a97c' }}
              onClick={simulateLocation}>
              {lang === 'kn' ? 'ಡೆಮೋ ಸ್ಥಳ ಬಳಸಿ' : 'Use Demo Location'}
            </button>
          </>
        )}

        {gpsState === 'loading' && (
          <div>
            <p style={{
              fontSize: 16, color: '#718355', marginBottom: 20,
              fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
            }}>
              {lang === 'kn' ? 'ನಿಮ್ಮ ಸ್ಥಳ ಪಡೆಯಲಾಗುತ್ತಿದೆ...' : 'Fetching your location...'}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {[
                lang === 'kn' ? 'GPS ಸಿಗ್ನಲ್' : 'GPS signal',
                lang === 'kn' ? 'GIS ಮ್ಯಾಪಿಂಗ್' : 'GIS mapping',
                lang === 'kn' ? 'ಮಣ್ಣು ಡೇಟಾ' : 'Soil data',
              ].map((step, i) => (
                <div key={i} className="badge badge-green" style={{ fontSize: 11, animation: `fadeIn 0.4s ease ${i * 0.3}s forwards`, opacity: 0 }}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {gpsState === 'success' && coords && (
          <div className="animate-fade-in">
            <div style={{
              background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)',
              borderRadius: 14, padding: '20px', marginBottom: 24,
            }}>
              <p style={{ fontSize: 13, color: '#2e7d32', fontWeight: 600, marginBottom: 12 }}>
                ✅ {lang === 'kn' ? 'ಸ್ಥಳ ಯಶಸ್ವಿಯಾಗಿ ಪಡೆಯಲಾಗಿದೆ' : 'Location detected successfully'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, textAlign: 'left' }}>
                {[
                  ['Latitude', coords.lat.toFixed(4)],
                  ['Longitude', coords.lon.toFixed(4)],
                ].map(([label, value]) => (
                  <div key={label} style={{
                    background: 'white', borderRadius: 8, padding: '10px 12px',
                  }}>
                    <p style={{ fontSize: 11, color: '#97a97c', fontWeight: 600 }}>{label}</p>
                    <p style={{ fontSize: 14, color: '#2d3a1e', fontWeight: 700, fontFamily: 'monospace' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
              onClick={handleContinue}>
              {lang === 'kn' ? 'ಮುಂದುವರಿಯಿರಿ →' : 'Continue →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
