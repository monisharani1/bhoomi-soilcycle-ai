import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, CheckCircle, AlertCircle, Loader, AlertTriangle, Building2, Leaf } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon (Vite/webpack bundler issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom green farmer marker
const farmerIcon = new L.DivIcon({
  html: `<div style="
    width:38px;height:38px;border-radius:50%;
    background:linear-gradient(135deg,#4a5c33,#718355);
    border:3px solid white;
    box-shadow:0 4px 16px rgba(74,92,51,0.5);
    display:flex;align-items:center;justify-content:center;
    font-size:18px;
  ">🌾</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -22],
  className: '',
});

// Helper to smoothly pan map to new center
function MapCenter({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 16, { animate: true }); }, [center]);
  return null;
}

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// ── Steps: idle → locating → checking → done ─────────────────
const STEPS = {
  idle: { label: 'Waiting for GPS...', icon: '📡' },
  locating: { label: 'Getting your GPS location...', icon: '🛰️' },
  checking: { label: 'Scanning map for structures...', icon: '🗺️' },
  soil: { label: 'Detecting soil type...', icon: '🌱' },
  done: { label: 'Analysis complete!', icon: '✅' },
};

export default function GPSScreen() {
  const { lang, setScreen, setLocation, setSoilData, detectSoilFromLocation, t } = useApp();

  const [phase, setPhase] = useState('idle'); // idle | locating | checking | soil | done | error
  const [coords, setCoords] = useState(null);
  const [buildingData, setBuildingData] = useState(null);
  const [soilResult, setSoilResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [mapReady, setMapReady] = useState(false);

  // ── Main detection flow ───────────────────────────────────
  const runDetection = async (lat, lon) => {
    setCoords({ lat, lon });
    setLocation({ lat, lon });
    setMapReady(true);

    // Step 1: Check buildings via Overpass API
    setPhase('checking');
    try {
      const res = await fetch(`${BACKEND}/api/location/check-buildings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lon, radius: 80 }),
      });
      const data = await res.json();
      setBuildingData(data);
    } catch {
      setBuildingData({ success: false, has_buildings: false, error: 'Building scan unavailable' });
    }

    // Step 2: Detect soil
    setPhase('soil');
    const soil = await detectSoilFromLocation(lat, lon);
    setSoilData(soil);
    setSoilResult(soil);

    setPhase('done');
  };

  // ── Get real GPS ──────────────────────────────────────────
  const handleGetLocation = () => {
    setPhase('locating');
    setErrorMsg('');
    setBuildingData(null);
    setSoilResult(null);
    setMapReady(false);

    if (!navigator.geolocation) {
      simulateLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        await runDetection(pos.coords.latitude, pos.coords.longitude);
      },
      () => simulateLocation(),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // ── Demo location (Mandya farm area) ─────────────────────
  const simulateLocation = async () => {
    // Spread within Mandya region for variety
    const demoLat = 12.5211 + (Math.random() - 0.5) * 0.4;
    const demoLon = 76.8958 + (Math.random() - 0.5) * 0.4;
    await runDetection(demoLat, demoLon);
  };

  const handleContinue = () => setScreen('app');

  // ── Step progress bar ─────────────────────────────────────
  const stepOrder = ['locating', 'checking', 'soil', 'done'];
  const stepIdx = stepOrder.indexOf(phase);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f0f9e8 0%, #e4f3d4 50%, #d6ecbe 100%)',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #4a5c33, #718355)',
        padding: '20px 24px 24px',
        color: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Leaf size={20} color="#e9f5db"/>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Bhoomi GPS Scanner</span>
        </div>
        <p style={{ fontSize: 13, opacity: 0.8 }}>
          {lang === 'kn' ? 'ನಿಮ್ಮ ಜಮೀನಿನ ಸ್ಥಳ ಮತ್ತು ಮಣ್ಣು ಪತ್ತೆಮಾಡಿ' : 'Detect your farm location, soil type & nearby structures'}
        </p>
      </div>

      <div style={{ flex: 1, padding: '20px 20px 32px', overflow: 'auto' }}>

        {/* ── Idle: Start button ─────────────────────────────── */}
        {phase === 'idle' && (
          <div className="glass-card" style={{ padding: '36px 28px', textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              background: 'linear-gradient(135deg, #718355, #4a5c33)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 32px rgba(74,92,51,0.3)',
              animation: 'pulse-ring 2s ease infinite',
            }}>
              <Navigation size={38} color="#e9f5db"/>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#2d3a1e', marginBottom: 10,
              fontFamily: "'Noto Sans Kannada', 'Poppins', sans-serif" }}>
              {lang === 'kn' ? 'ಸ್ಥಳ ಅನುಮತಿ ನೀಡಿ' : 'Detect Your Location'}
            </h2>
            <p style={{ fontSize: 14, color: '#718355', lineHeight: 1.7, marginBottom: 28,
              fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif" }}>
              {lang === 'kn'
                ? 'GPS ಮೂಲಕ ನಿಮ್ಮ ಜಮೀನಿನ ಸ್ಥಳ, ಮಣ್ಣಿನ ಪ್ರಕಾರ ಮತ್ತು ಸುತ್ತಮುತ್ತಲಿನ ಕಟ್ಟಡಗಳನ್ನು ಪತ್ತೆಮಾಡಿ.'
                : 'We\'ll use GPS to detect your farm location, soil type, and scan for any buildings nearby.'}
            </p>

            {/* What we scan */}
            <div style={{ background: 'rgba(113,131,85,0.08)', borderRadius: 14, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
              {[
                { icon: '📍', text: lang === 'kn' ? 'ನಿಖರ GPS ನಿರ್ದೇಶಾಂಕಗಳು' : 'Exact GPS coordinates' },
                { icon: '🗺️', text: lang === 'kn' ? 'OpenStreetMap ಕಟ್ಟಡ ಸ್ಕ್ಯಾನ್' : 'OpenStreetMap building scan (80m radius)' },
                { icon: '🧪', text: lang === 'kn' ? 'ಮಣ್ಣಿನ ಪ್ರಕಾರ ಮತ್ತು NPK' : 'Soil type & NPK values' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 2 ? 12 : 0, alignItems: 'center' }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: '#4a5c33', fontFamily: "'Inter', sans-serif" }}>{item.text}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary" id="get-location-btn"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', marginBottom: 12, fontSize: 15 }}
              onClick={handleGetLocation}>
              <MapPin size={18}/> {t('allowLocation')}
            </button>
            <button className="btn-ghost"
              style={{ width: '100%', justifyContent: 'center', color: '#718355' }}
              onClick={simulateLocation}>
              {lang === 'kn' ? '🧪 ಡೆಮೋ ಸ್ಥಳ ಬಳಸಿ (Mandya)' : '🧪 Use Demo Location (Mandya)'}
            </button>
          </div>
        )}

        {/* ── In Progress ─────────────────────────────────────── */}
        {['locating', 'checking', 'soil'].includes(phase) && (
          <div className="glass-card" style={{ padding: '32px 24px', textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #718355, #4a5c33)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(74,92,51,0.3)',
            }}>
              <Loader size={30} color="#e9f5db" style={{ animation: 'spin-slow 1s linear infinite' }}/>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2d3a1e', marginBottom: 8 }}>
              {STEPS[phase]?.icon} {STEPS[phase]?.label}
            </h3>

            {/* Progress steps */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {stepOrder.map((s, i) => (
                <div key={s} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <div style={{
                    width: i <= stepIdx ? 24 : 20,
                    height: i <= stepIdx ? 24 : 20,
                    borderRadius: '50%',
                    background: i < stepIdx ? '#718355' : i === stepIdx ? '#4a5c33' : '#cfe1b9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}>
                    {i < stepIdx
                      ? <CheckCircle size={14} color="white"/>
                      : <span style={{ fontSize: 9, color: i === stepIdx ? 'white' : '#97a97c', fontWeight: 700 }}>{i+1}</span>}
                  </div>
                  {i < stepOrder.length - 1 && (
                    <div style={{ width: 20, height: 2, background: i < stepIdx ? '#718355' : '#cfe1b9', transition: 'background 0.3s' }}/>
                  )}
                </div>
              ))}
            </div>

            {coords && (
              <div style={{ marginTop: 20, background: 'rgba(113,131,85,0.08)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#4a5c33', fontFamily: 'monospace' }}>
                📍 {coords.lat.toFixed(6)}°N, {coords.lon.toFixed(6)}°E
              </div>
            )}
          </div>
        )}

        {/* ── Map (shown once coords available) ─────────────── */}
        {mapReady && coords && (
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 16, boxShadow: '0 8px 32px rgba(74,92,51,0.2)' }}>
            <div style={{
              background: 'linear-gradient(135deg, #4a5c33, #718355)',
              padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <MapPin size={16} color="#e9f5db"/>
              <span style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>Live Map</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginLeft: 'auto' }}>
                OpenStreetMap
              </span>
            </div>

            <MapContainer
              center={[coords.lat, coords.lon]}
              zoom={16}
              style={{ height: 280, width: '100%' }}
              attributionControl={false}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />
              <MapCenter center={[coords.lat, coords.lon]}/>

              {/* Farmer location marker */}
              <Marker position={[coords.lat, coords.lon]} icon={farmerIcon}>
                <Popup>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                    <strong>🌾 Your Location</strong><br/>
                    {coords.lat.toFixed(5)}°N, {coords.lon.toFixed(5)}°E
                    {soilResult && <><br/>🧪 {soilResult.soilType}</>}
                  </div>
                </Popup>
              </Marker>

              {/* 80m scan radius */}
              <Circle
                center={[coords.lat, coords.lon]}
                radius={80}
                pathOptions={{
                  color: buildingData?.has_buildings ? '#e74c3c' : '#718355',
                  fillColor: buildingData?.has_buildings ? '#e74c3c' : '#718355',
                  fillOpacity: 0.06,
                  weight: 2,
                  dashArray: '6 4',
                }}
              />
            </MapContainer>

            <div style={{
              background: 'white', padding: '10px 16px', borderTop: '1px solid #e9f5db',
              display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#718355',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px dashed #718355' }}/>
              80m scan radius
              {buildingData?.has_buildings && (
                <span style={{ marginLeft: 'auto', color: '#e74c3c', fontWeight: 600 }}>
                  ⚠️ {buildingData.structure_count} structure(s) detected
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Building Caution ───────────────────────────────── */}
        {buildingData?.has_buildings && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(231,76,60,0.1), rgba(231,76,60,0.06))',
            border: '1.5px solid rgba(231,76,60,0.35)',
            borderRadius: 16, padding: '18px 20px', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: 'rgba(231,76,60,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Building2 size={22} color="#e74c3c"/>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#c0392b', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={16}/> {lang === 'kn' ? 'ಕಟ್ಟಡ ಎಚ್ಚರಿಕೆ' : 'Building Detected — Caution'}
                </p>
                <p style={{ fontSize: 13, color: '#922b21', lineHeight: 1.6 }}>
                  {lang === 'kn'
                    ? `ನಿಮ್ಮ ಸ್ಥಳದ ${buildingData.radius_meters}m ಒಳಗೆ ${buildingData.structure_count} ರಚನೆ(ಗಳು) ಪತ್ತೆಯಾಗಿವೆ. ಈ ಪ್ರದೇಶವು ಕೃಷಿಗೆ ಸೂಕ್ತವಲ್ಲದಿರಬಹುದು.`
                    : `${buildingData.structure_count} structure(s) detected within ${buildingData.radius_meters}m of your GPS location. This area may overlap with built-up zones — confirm this is open farmland.`}
                </p>
                {buildingData.structure_types?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    {buildingData.structure_types.map((t, i) => (
                      <span key={i} style={{
                        background: 'rgba(231,76,60,0.12)', color: '#c0392b',
                        borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600,
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── No buildings ───────────────────────────────────── */}
        {buildingData?.success && !buildingData.has_buildings && (
          <div style={{
            background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)',
            borderRadius: 14, padding: '14px 18px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <CheckCircle size={20} color="#4caf50" style={{ flexShrink: 0 }}/>
            <p style={{ fontSize: 13, color: '#2e7d32', fontWeight: 500 }}>
              ✅ {lang === 'kn' ? 'ಕಟ್ಟಡಗಳಿಲ್ಲ — ಕೃಷಿ ಭೂಮಿ ಎಂದು ದೃಢೀಕರಿಸಲಾಗಿದೆ' : 'No buildings detected within 80m — area looks like open farmland'}
            </p>
          </div>
        )}

        {/* ── Soil Result ────────────────────────────────────── */}
        {soilResult && phase === 'done' && (
          <div className="glass-card" style={{ padding: '20px', marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#97a97c', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
              🧪 Soil Detection Result
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[
                { label: 'District', value: soilResult.district },
                { label: 'State', value: soilResult.state },
                { label: 'Soil Type', value: soilResult.soilType, span: true },
                { label: 'Confidence', value: `${soilResult.confidence}%` },
                { label: 'Source', value: soilResult.source === 'api' ? '🔌 Backend API' : '📦 Local Data' },
              ].map(({ label, value, span }) => (
                <div key={label} style={{
                  background: 'rgba(113,131,85,0.07)', borderRadius: 10, padding: '10px 12px',
                  ...(span ? { gridColumn: '1 / -1' } : {}),
                }}>
                  <p style={{ fontSize: 11, color: '#97a97c', fontWeight: 600, marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#2d3a1e' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* NPK pills */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: 'N', value: soilResult.npkLabels?.n || (soilResult.npk.n > 60 ? 'High' : soilResult.npk.n > 40 ? 'Medium' : 'Low'), color: '#4a9c4e' },
                { label: 'P', value: soilResult.npkLabels?.p || (soilResult.npk.p > 60 ? 'High' : soilResult.npk.p > 40 ? 'Medium' : 'Low'), color: '#e07c2a' },
                { label: 'K', value: soilResult.npkLabels?.k || (soilResult.npk.k > 60 ? 'High' : soilResult.npk.k > 40 ? 'Medium' : 'Low'), color: '#8b6cb8' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  flex: 1, background: `${color}15`, border: `1.5px solid ${color}40`,
                  borderRadius: 10, padding: '10px 8px', textAlign: 'center',
                }}>
                  <p style={{ fontSize: 16, fontWeight: 900, color }}>{label}</p>
                  <p style={{ fontSize: 11, color, fontWeight: 600, marginTop: 2 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Coordinates card ───────────────────────────────── */}
        {coords && phase === 'done' && (
          <div style={{
            background: 'rgba(74,92,51,0.06)', border: '1px solid #cfe1b9',
            borderRadius: 14, padding: '12px 16px', marginBottom: 16,
            display: 'flex', justifyContent: 'space-around',
          }}>
            {[['Latitude', coords.lat.toFixed(6) + '°N'], ['Longitude', coords.lon.toFixed(6) + '°E']].map(([l, v]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#97a97c', fontWeight: 600 }}>{l}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#4a5c33', fontFamily: 'monospace' }}>{v}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Continue button ────────────────────────────────── */}
        {phase === 'done' && (
          <button className="btn-primary" id="continue-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '17px', fontSize: 16, marginBottom: 12 }}
            onClick={handleContinue}>
            {lang === 'kn' ? 'ಅಪ್ಲಿಕೇಶನ್ ತೆರೆಯಿರಿ →' : 'Open App Dashboard →'}
          </button>
        )}

        {/* ── Error state ─────────────────────────────────────── */}
        {phase === 'error' && (
          <div style={{
            background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)',
            borderRadius: 14, padding: '20px', textAlign: 'center', marginBottom: 16,
          }}>
            <AlertCircle size={32} color="#c0392b" style={{ marginBottom: 12 }}/>
            <p style={{ fontSize: 14, color: '#c0392b', fontWeight: 600 }}>{errorMsg}</p>
            <button className="btn-ghost" style={{ marginTop: 14 }} onClick={handleGetLocation}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
