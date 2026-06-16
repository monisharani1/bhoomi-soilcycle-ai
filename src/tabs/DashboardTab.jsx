import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cropDatabase } from '../data/bhoomiData';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { Leaf, TrendingUp, AlertTriangle, CheckCircle, MapPin, Droplets, Activity, Pencil, X, ChevronRight } from 'lucide-react';

// ── Crop Picker Modal ─────────────────────────────────────────────────────────
const SEASONS = ['All Year', 'Kharif', 'Rabi', 'Summer', 'Kharif/Rabi', 'Rabi/Summer', 'Annual'];

function CropPickerModal({ open, onClose, onSelect, lang, currentCrop }) {
  const [search, setSearch] = useState('');
  const [activeSeason, setActiveSeason] = useState('All');

  if (!open) return null;

  const crops = Object.entries(cropDatabase);

  const seasons = ['All', 'Kharif', 'Rabi', 'Summer', 'Annual'];

  const filtered = crops.filter(([name, data]) => {
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      data.nameKn?.includes(search);
    const matchSeason = activeSeason === 'All' || data.season?.includes(activeSeason);
    return matchSearch && matchSeason;
  });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(3px)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        background: 'white',
        borderRadius: '24px 24px 0 0',
        zIndex: 1001,
        maxHeight: '88vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#dde8cc' }}/>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px 12px',
          borderBottom: '1px solid #f0f6e8',
        }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#2d3a1e',
              fontFamily: "'Noto Sans Kannada', 'Poppins', sans-serif" }}>
              🌾 {lang === 'kn' ? 'ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ' : 'Select Current Crop'}
            </h3>
            <p style={{ fontSize: 12, color: '#97a97c', marginTop: 2 }}>
              {lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ' : 'Choose what you are currently growing'}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#f0f6e8', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={18} color="#718355"/>
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 20px 0' }}>
          <input
            type="text"
            placeholder={lang === 'kn' ? '🔍 ಬೆಳೆ ಹುಡುಕಿ...' : '🔍 Search crop...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 12,
              border: '1.5px solid #cfe1b9', fontSize: 14, outline: 'none',
              background: '#fafff6', fontFamily: "'Inter', sans-serif",
              boxSizing: 'border-box',
            }}
            autoFocus
          />
        </div>

        {/* Season filter tabs */}
        <div style={{
          display: 'flex', gap: 8, padding: '12px 20px',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {seasons.map(s => (
            <button key={s}
              onClick={() => setActiveSeason(s)}
              style={{
                padding: '6px 14px', borderRadius: 20, border: 'none',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                background: activeSeason === s ? '#4a5c33' : '#f0f6e8',
                color: activeSeason === s ? 'white' : '#718355',
                transition: 'all 0.2s',
              }}>
              {s}
            </button>
          ))}
        </div>

        {/* Crop list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#97a97c' }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>🌿</p>
              <p style={{ fontSize: 14 }}>No crops found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(([name, data]) => {
                const isSelected = currentCrop === name;
                return (
                  <button
                    key={name}
                    onClick={() => { onSelect(name, data.season); onClose(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px', borderRadius: 16, border: 'none',
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(74,92,51,0.12), rgba(113,131,85,0.08))'
                        : 'rgba(240,246,232,0.6)',
                      border: isSelected ? '1.5px solid #718355' : '1.5px solid transparent',
                      transition: 'all 0.15s',
                    }}
                  >
                    {/* Emoji */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: isSelected ? 'rgba(74,92,51,0.15)' : 'rgba(113,131,85,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, flexShrink: 0,
                    }}>
                      {data.icon}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: '#2d3a1e' }}>{name}</p>
                        <span style={{
                          background: '#e9f5db', color: '#4a5c33',
                          fontSize: 10, fontWeight: 600,
                          padding: '2px 8px', borderRadius: 10,
                        }}>
                          {data.season}
                        </span>
                        {isSelected && (
                          <span style={{
                            background: '#4a5c33', color: 'white',
                            fontSize: 10, fontWeight: 700,
                            padding: '2px 8px', borderRadius: 10,
                          }}>✓ Set</span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#97a97c',
                        fontFamily: "'Noto Sans Kannada', sans-serif" }}>
                        {data.nameKn} · {data.duration} · 💧 {data.waterReq}
                      </p>
                    </div>

                    <ChevronRight size={16} color="#cfe1b9"/>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100%); }
          to   { transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}

const CircleGauge = ({ value, size = 140, label }) => {
  const r = 52, cx = 70, cy = 70;
  const circumference = 2 * Math.PI * r;
  const stroke = circumference - (value / 100) * circumference;
  const color = value >= 70 ? '#87986a' : value >= 45 ? '#c8872a' : '#dc4c3c';

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e9f5db" strokeWidth="12"/>
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={stroke}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.5s ease' }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="26" fontWeight="800" fill="#2d3a1e" fontFamily="Inter">
          {value}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#718355" fontFamily="Inter">%</text>
      </svg>
      {label && <p style={{ fontSize: 12, color: '#718355', fontWeight: 600, marginTop: 4 }}>{label}</p>}
    </div>
  );
};

const NPKBar = ({ label, value, max = 100, color, symbol }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#4a5c33' }}>
        {symbol} {label}
      </span>
      <span style={{ fontSize: 13, fontWeight: 700, color: value < 40 ? '#c0392b' : '#2d3a1e' }}>
        {value.toFixed(0)} <span style={{ color: '#97a97c', fontWeight: 400 }}>/ {max} kg/ha</span>
      </span>
    </div>
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${(value / max) * 100}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
      />
    </div>
    {value < 40 && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <AlertTriangle size={11} color="#c0392b"/>
        <span style={{ fontSize: 11, color: '#c0392b', fontWeight: 500 }}>Low level detected</span>
      </div>
    )}
  </div>
);

export default function DashboardTab() {
  const { soilData, recommendations, farmInputs, setFarmInputs, lang, t } = useApp();
  const [cropModalOpen, setCropModalOpen] = useState(false);

  const handleCropSelect = (cropName, season) => {
    setFarmInputs(prev => ({
      ...prev,
      currentCrop: cropName,
      season: season?.toLowerCase().includes('kharif') ? 'kharif'
             : season?.toLowerCase().includes('rabi') ? 'rabi'
             : season?.toLowerCase().includes('summer') ? 'summer'
             : prev.season,
    }));
  };

  const npk = recommendations?.adjustedNPK || soilData?.npk || { n: 55, p: 48, k: 72 };
  const healthScore = recommendations?.soilHealthScore || 67;
  const cropHistory = [
    { month: 'Jan', health: 80 }, { month: 'Mar', health: 72 },
    { month: 'May', health: 58 }, { month: 'Jul', health: 65 },
    { month: 'Sep', health: 55 }, { month: 'Nov', health: 67 },
  ];

  const statsCards = [
    {
      icon: <Activity size={20}/>,
      label: lang === 'kn' ? 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ' : 'Soil Health',
      value: `${healthScore}%`,
      sub: healthScore >= 70 ? (lang === 'kn' ? 'ಉತ್ತಮ' : 'Good') : (lang === 'kn' ? 'ಸಂಸ್ಕರಣೆ ಬೇಕು' : 'Needs attention'),
      color: '#718355', bgColor: 'rgba(113,131,85,0.1)',
      icon2: healthScore >= 70 ? <CheckCircle size={14} color="#4caf50"/> : <AlertTriangle size={14} color="#ff9800"/>,
    },
    {
      icon: <MapPin size={20}/>,
      label: lang === 'kn' ? 'ಪ್ರದೇಶ' : 'Region',
      value: soilData?.district || 'Mandya',
      sub: soilData?.state || 'Karnataka',
      color: '#2980b9', bgColor: 'rgba(41,128,185,0.1)',
      icon2: null,
    },
    {
      icon: <Leaf size={20}/>,
      label: lang === 'kn' ? 'ಮಣ್ಣಿನ ಪ್ರಕಾರ' : 'Soil Type',
      value: lang === 'kn' ? (soilData?.soilTypeKn || 'ಕೆಂಪು ಮಣ್ಣು') : (soilData?.soilType || 'Red Sandy Loam'),
      sub: `${soilData?.confidence || 87}% confidence`,
      color: '#8b5e10', bgColor: 'rgba(139,94,16,0.1)',
      icon2: null,
    },
    {
      icon: <Droplets size={20}/>,
      label: lang === 'kn' ? 'ಪ್ರಸ್ತುತ ಬೆಳೆ' : 'Current Crop',
      value: farmInputs.currentCrop
        ? `${cropDatabase[farmInputs.currentCrop]?.icon || '🌿'} ${farmInputs.currentCrop}`
        : (lang === 'kn' ? 'ನಮೂದಿಸಿಲ್ಲ' : 'Tap to set'),
      sub: farmInputs.currentCrop && farmInputs.season ? (farmInputs.season === 'kharif' ? 'Kharif' : farmInputs.season === 'rabi' ? 'Rabi' : 'Summer') : (lang === 'kn' ? 'ಟ್ಯಾಪ್ ಮಾಡಿ' : ''),
      color: '#6b4c2a', bgColor: 'rgba(107,76,42,0.1)',
      icon2: <Pencil size={13} color="#97a97c"/>,
      onClick: () => setCropModalOpen(true),
    },
  ];

  return (
    <div style={{ padding: '0 0 32px' }}>
      <CropPickerModal
        open={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        onSelect={handleCropSelect}
        lang={lang}
        currentCrop={farmInputs.currentCrop}
      />
      {/* Greeting banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4a5c33, #718355)',
        borderRadius: 20, padding: '28px 28px',
        marginBottom: 24, position: 'relative', overflow: 'hidden',
        color: 'white',
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 160, height: 160,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }}/>
        <div style={{
          position: 'absolute', bottom: -30, right: 60,
          width: 100, height: 100,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }}/>
        <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 4, fontFamily: "'Noto Sans Kannada', sans-serif" }}>
          {lang === 'kn' ? 'ನಮಸ್ಕಾರ 🙏' : 'Welcome back 🙏'}
        </p>
        <h2 style={{
          fontSize: 24, fontWeight: 800, marginBottom: 8,
          fontFamily: "'Noto Sans Kannada', 'Poppins', sans-serif",
        }}>
          {lang === 'kn' ? 'ಭೂಮಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : 'Bhoomi Dashboard'}
        </h2>
        <p style={{ fontSize: 14, opacity: 0.75, fontFamily: "'Noto Sans Kannada', sans-serif" }}>
          📍 {soilData?.district || 'Mandya'}, {soilData?.state || 'Karnataka'}
          {soilData && ` • ${soilData.lat}°N, ${soilData.lon}°E`}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 24,
      }}>
        {statsCards.map((card, i) => (
          <div
            key={i}
            className="metric-card"
            style={{
              padding: '18px',
              cursor: card.onClick ? 'pointer' : 'default',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onClick={card.onClick}
            onMouseEnter={e => { if (card.onClick) e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { if (card.onClick) e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: card.bgColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.color,
              }}>
                {card.icon}
              </div>
              {card.icon2}
            </div>
            <p style={{ fontSize: 11, color: '#97a97c', fontWeight: 600, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {card.label}
            </p>
            <p style={{
              fontSize: 15, fontWeight: 800, color: card.onClick && !farmInputs.currentCrop ? '#97a97c' : '#2d3a1e',
              fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
              marginBottom: 2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {card.value}
            </p>
            <p style={{ fontSize: 11, color: '#97a97c' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Soil Health + NPK */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2d3a1e', marginBottom: 20,
          fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif" }}>
          🧪 {lang === 'kn' ? 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಅಂಕ & NPK' : 'Soil Health Score & NPK'}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <CircleGauge value={healthScore} label={lang === 'kn' ? 'ಆರೋಗ್ಯ' : 'Health'}/>
          <div style={{ flex: 1 }}>
            <NPKBar label={t('nitrogen')} value={npk.n} color="#4a9c4e" symbol="N"/>
            <NPKBar label={t('phosphorus')} value={npk.p} color="#e07c2a" symbol="P"/>
            <NPKBar label={t('potassium')} value={npk.k} color="#8b6cb8" symbol="K"/>
          </div>
        </div>
      </div>

      {/* Soil health history */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2d3a1e', marginBottom: 20,
          fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif" }}>
          📈 {lang === 'kn' ? 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಇತಿಹಾಸ' : 'Soil Health History'}
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={cropHistory}>
            <defs>
              <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#718355" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#718355" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(113,131,85,0.15)"/>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#97a97c' }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize: 11, fill: '#97a97c' }} axisLine={false} tickLine={false} domain={[40, 100]}/>
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #cfe1b9', borderRadius: 8, fontSize: 12 }}/>
            <Area type="monotone" dataKey="health" stroke="#718355" strokeWidth={2.5} fill="url(#healthGrad)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick actions */}
      {recommendations?.deficiencies?.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(220,76,60,0.08), rgba(220,76,60,0.04))',
          border: '1px solid rgba(220,76,60,0.2)',
          borderRadius: 16, padding: '20px 20px',
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <AlertTriangle size={20} color="#c0392b" style={{ flexShrink: 0, marginTop: 2 }}/>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#c0392b', marginBottom: 6,
                fontFamily: "'Noto Sans Kannada', sans-serif" }}>
                {lang === 'kn' ? 'ಪೋಷಕಾಂಶ ಕೊರತೆ ಪತ್ತೆ' : 'Nutrient Deficiency Detected'}
              </p>
              <p style={{ fontSize: 13, color: '#8b2a1a' }}>
                {recommendations.deficiencies.map(d => d.toUpperCase()).join(', ')} deficiency detected.
                {' '}{lang === 'kn' ? 'ಶಿಫಾರಸು ಟ್ಯಾಬ್ ನೋಡಿ.' : 'Check Recommendations tab.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
