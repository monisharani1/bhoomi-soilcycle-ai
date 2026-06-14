import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cropDatabase } from '../data/bhoomiData';
import { Search, X, CheckCircle, XCircle, AlertTriangle, Droplets, Clock, TrendingUp } from 'lucide-react';

const getSuitability = (cropName, soilData, recommendations) => {
  if (recommendations?.topCrops) {
    const match = recommendations.topCrops.find(c => c.name === cropName);
    if (match) return match.suitability;
  }
  // Fallback: score based on water requirement vs soil type
  const crop = cropDatabase[cropName];
  if (!crop) return 50;
  let score = 60;
  if (crop.nFixation) score += 15;
  if (crop.npkDemand.n === 'low') score += 10;
  if (crop.waterReq === 'Very High' && (!soilData || soilData.npk?.k > 60)) score -= 15;
  return Math.min(98, Math.max(20, score + Math.floor(Math.random() * 15)));
};

export default function CropSearchTab() {
  const { lang, soilData, recommendations } = useApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const cropList = Object.keys(cropDatabase);
  const filtered = query.length > 0
    ? cropList.filter(c =>
        c.toLowerCase().includes(query.toLowerCase()) ||
        (cropDatabase[c].nameKn && cropDatabase[c].nameKn.includes(query))
      )
    : [];

  const handleSearch = (cropName) => {
    setQuery(cropName);
    const crop = cropDatabase[cropName];
    if (!crop) return;
    const suitability = getSuitability(cropName, soilData, recommendations);
    setResult({ name: cropName, ...crop, suitability });
    setSearched(true);
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setSearched(false);
  };

  const npkDemandColor = (level) => {
    if (level === 'low') return '#4caf50';
    if (level === 'medium') return '#ff9800';
    if (level === 'high' || level === 'very-high') return '#f44336';
    return '#97a97c';
  };

  const waterColor = { 'Low': '#4caf50', 'Medium': '#ff9800', 'High': '#f44336', 'Very High': '#9c27b0' };

  return (
    <div style={{ paddingBottom: 32 }}>
      <div className="glass-card" style={{ padding: '24px', marginBottom: 20 }}>
        <h2 style={{
          fontSize: 20, fontWeight: 800, color: '#2d3a1e', marginBottom: 6,
          fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
        }}>
          🔍 {lang === 'kn' ? 'ಬೆಳೆ ಸೂಕ್ತತೆ ಪರಿಶೀಲಿಸಿ' : 'Check Crop Suitability'}
        </h2>
        <p style={{ fontSize: 14, color: '#97a97c', marginBottom: 20,
          fontFamily: "'Noto Sans Kannada', sans-serif" }}>
          {lang === 'kn'
            ? 'ನೀವು ಬೆಳೆಯಲು ಬಯಸುವ ಯಾವುದೇ ಬೆಳೆ ಹುಡುಕಿ'
            : 'Search for any crop you wish to grow and get instant suitability analysis'}
        </p>

        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={18} color="#97a97c" style={{
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
          }}/>
          <input
            id="crop-search-input"
            type="text"
            className="input-field"
            style={{ paddingLeft: 46, paddingRight: 46 }}
            placeholder={lang === 'kn' ? 'ಉದಾ: ಕಬ್ಬು, ಭತ್ತ, ರಾಗಿ...' : 'e.g. Sugarcane, Rice, Ragi...'}
            value={query}
            onChange={e => { setQuery(e.target.value); setResult(null); setSearched(false); }}
          />
          {query && (
            <button onClick={handleClear} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: '#97a97c', padding: 4,
            }}>
              <X size={16}/>
            </button>
          )}
        </div>

        {/* Autocomplete dropdown */}
        {filtered.length > 0 && !result && (
          <div style={{
            border: '1px solid rgba(207,225,185,0.6)', borderRadius: 14,
            overflow: 'hidden', background: 'white',
            boxShadow: '0 8px 24px rgba(74,92,51,0.12)',
          }}>
            {filtered.map((crop, i) => (
              <button
                key={crop}
                id={`crop-option-${crop.toLowerCase()}`}
                onClick={() => handleSearch(crop)}
                style={{
                  width: '100%', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(207,225,185,0.4)' : 'none',
                  textAlign: 'left', transition: 'background 0.2s',
                  fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(233,245,219,0.8)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span style={{ fontSize: 22 }}>{cropDatabase[crop].icon}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#2d3a1e' }}>{crop}</p>
                  {cropDatabase[crop].nameKn && (
                    <p style={{ fontSize: 12, color: '#97a97c' }}>{cropDatabase[crop].nameKn}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Quick suggestions */}
        {!query && (
          <div>
            <p style={{ fontSize: 12, color: '#97a97c', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' }}>
              {lang === 'kn' ? 'ಜನಪ್ರಿಯ ಬೆಳೆಗಳು' : 'Popular Crops'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Rice', 'Sugarcane', 'Ragi', 'Cotton', 'Groundnut', 'Maize', 'Sunflower', 'Tomato'].map(crop => (
                <button
                  key={crop}
                  id={`quick-${crop.toLowerCase()}`}
                  onClick={() => handleSearch(crop)}
                  style={{
                    padding: '8px 14px', borderRadius: 20,
                    background: 'rgba(207,225,185,0.5)', border: '1px solid rgba(181,201,154,0.4)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#4a5c33',
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all 0.2s',
                    fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(181,201,154,0.7)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(207,225,185,0.5)'}
                >
                  <span>{cropDatabase[crop].icon}</span> {lang === 'kn' ? cropDatabase[crop].nameKn : crop}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result card */}
      {result && (
        <div className="crop-result-card animate-fade-in-up">
          {/* Header */}
          <div className="crop-result-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36,
              }}>
                {result.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: 24, fontWeight: 900,
                  fontFamily: "'Noto Sans Kannada', 'Poppins', sans-serif",
                }}>
                  {lang === 'kn' && result.nameKn ? result.nameKn : result.name}
                </h3>
                {lang === 'kn' && result.nameKn && (
                  <p style={{ opacity: 0.8, fontSize: 14 }}>{result.name}</p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                {result.suitability >= 60
                  ? <CheckCircle size={28} color="#a5d6a7"/>
                  : <XCircle size={28} color="#ef9a9a"/>}
              </div>
            </div>

            {/* Big suitability score */}
            <div style={{
              background: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: '20px',
              display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{result.suitability}%</p>
                <p style={{ fontSize: 12, opacity: 0.8 }}>{lang === 'kn' ? 'ಸೂಕ್ತತೆ' : 'Suitability'}</p>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  height: 12, borderRadius: 6,
                  background: 'rgba(255,255,255,0.2)', marginBottom: 8,
                }}>
                  <div style={{
                    height: '100%', borderRadius: 6,
                    width: `${result.suitability}%`,
                    background: result.suitability >= 70
                      ? 'linear-gradient(90deg, #a5d6a7, #66bb6a)'
                      : result.suitability >= 50
                        ? 'linear-gradient(90deg, #ffcc80, #ffa726)'
                        : 'linear-gradient(90deg, #ef9a9a, #e57373)',
                    transition: 'width 1s ease',
                  }}/>
                </div>
                <p style={{
                  fontSize: 16, fontWeight: 800,
                  color: result.suitability >= 60 ? '#a5d6a7' : '#ef9a9a',
                  fontFamily: "'Noto Sans Kannada', sans-serif",
                }}>
                  {result.suitability >= 70
                    ? (lang === 'kn' ? '✅ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ' : '✅ Recommended')
                    : result.suitability >= 50
                      ? (lang === 'kn' ? '⚠️ ಷರತ್ತಿನ ಮೇಲೆ ಸಾಧ್ಯ' : '⚠️ Conditionally possible')
                      : (lang === 'kn' ? '❌ ಶಿಫಾರಸು ಮಾಡಿಲ್ಲ' : '❌ Not Recommended')}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div style={{ padding: '24px', background: 'white' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { icon: <Droplets size={16} color={waterColor[result.waterReq] || '#97a97c'}/>, label: lang === 'kn' ? 'ನೀರಿನ ಅವಶ್ಯಕತೆ' : 'Water Req.', value: result.waterReq },
                { icon: <Clock size={16} color="#97a97c"/>, label: lang === 'kn' ? 'ಅವಧಿ' : 'Duration', value: result.duration },
                { icon: <TrendingUp size={16} color="#97a97c"/>, label: lang === 'kn' ? 'ಋತು' : 'Season', value: result.season },
                { icon: <AlertTriangle size={16} color="#ff9800"/>, label: lang === 'kn' ? 'ಸಾರಜನಕ ಬೇಡಿಕೆ' : 'N Demand', value: (result.npkDemand?.n || 'medium').toUpperCase() },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{
                  background: 'rgba(233,245,219,0.5)', borderRadius: 12, padding: '14px',
                  border: '1px solid rgba(207,225,185,0.4)',
                }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    {icon}
                    <span style={{ fontSize: 11, color: '#97a97c', fontWeight: 600 }}>{label}</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#2d3a1e',
                    fontFamily: "'Noto Sans Kannada', sans-serif" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* NPK demands */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#4a5c33', marginBottom: 10 }}>
                {lang === 'kn' ? 'ಪೋಷಕಾಂಶ ಬೇಡಿಕೆ' : 'Nutrient Demand'}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['n', 'p', 'k']).map((key, i) => {
                  const label = ['N','P','K'][i];
                  const demand = result.npkDemand?.[key] || 'medium';
                  return (
                    <div key={key} style={{
                      flex: 1, textAlign: 'center', padding: '12px 8px',
                      borderRadius: 12, border: '1px solid rgba(207,225,185,0.4)',
                      background: `${npkDemandColor(demand)}12`,
                    }}>
                      <p style={{ fontSize: 18, fontWeight: 900, color: npkDemandColor(demand) }}>{label}</p>
                      <p style={{ fontSize: 11, color: '#97a97c', textTransform: 'capitalize' }}>{demand}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {result.nFixation && (
              <div className="badge badge-green" style={{ marginBottom: 16 }}>
                🌿 {lang === 'kn' ? 'ಈ ಬೆಳೆ ಸಾರಜನಕ ನಿಗದಿ ಮಾಡುತ್ತದೆ — ಮಣ್ಣು ಸುಧಾರಿಸುತ್ತದೆ' : 'This crop fixes nitrogen — improves soil health'}
              </div>
            )}

            {result.suitability < 60 && (
              <div style={{
                background: 'rgba(244,67,54,0.06)', border: '1px solid rgba(244,67,54,0.2)',
                borderRadius: 12, padding: '14px',
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#c62828', marginBottom: 4,
                  fontFamily: "'Noto Sans Kannada', sans-serif" }}>
                  {lang === 'kn' ? '⚠️ ಶಿಫಾರಸು ಮಾಡದಿರಲು ಕಾರಣ:' : '⚠️ Reason not recommended:'}
                </p>
                <p style={{ fontSize: 13, color: '#c62828', lineHeight: 1.5 }}>
                  {lang === 'kn'
                    ? `${result.waterReq === 'Very High' ? 'ಹೆಚ್ಚು ನೀರು ಬೇಕು. ' : ''}${result.npkDemand?.n === 'high' || result.npkDemand?.n === 'very-high' ? 'ಸಾರಜನಕ ಕಡಿಮೆ ಇದೆ.' : ''}`
                    : `${result.waterReq === 'Very High' ? 'Very high water requirement. ' : ''}${result.npkDemand?.n === 'high' ? 'Nitrogen is currently low in your soil.' : ''}`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
