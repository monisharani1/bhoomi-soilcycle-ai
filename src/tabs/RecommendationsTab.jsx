import { useApp } from '../context/AppContext';
import { cropDatabase } from '../data/bhoomiData';
import { TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const RiskBadge = ({ level }) => {
  const colors = { Low: '#4caf50', Medium: '#ff9800', High: '#f44336' };
  return (
    <span className="badge" style={{
      background: `${colors[level]}18`,
      color: colors[level],
      border: `1px solid ${colors[level]}30`,
    }}>
      {level === 'Low' ? '🟢' : level === 'Medium' ? '🟡' : '🔴'} {level}
    </span>
  );
};

const CropCard = ({ crop, rank, lang }) => {
  const isTop = rank === 1;
  const riskLevel = crop.suitability >= 75 ? 'Low' : crop.suitability >= 55 ? 'Medium' : 'High';

  return (
    <div style={{
      borderRadius: 18,
      border: isTop ? '2px solid #718355' : '1px solid rgba(207,225,185,0.6)',
      background: isTop
        ? 'linear-gradient(135deg, rgba(113,131,85,0.08), rgba(74,92,51,0.05))'
        : 'white',
      padding: '20px',
      position: 'relative',
      transition: 'all 0.3s',
      boxShadow: isTop ? '0 8px 24px rgba(74,92,51,0.15)' : '0 2px 8px rgba(74,92,51,0.06)',
    }}>
      {isTop && (
        <div style={{
          position: 'absolute', top: -12, left: 20,
          background: 'linear-gradient(135deg, #718355, #4a5c33)',
          color: 'white', fontSize: 11, fontWeight: 700,
          padding: '4px 12px', borderRadius: 20,
          boxShadow: '0 4px 12px rgba(113,131,85,0.4)',
        }}>
          ⭐ {lang === 'kn' ? 'ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆ' : 'Best Choice'}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: isTop ? 'linear-gradient(135deg, #718355, #4a5c33)' : 'rgba(233,245,219,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, flexShrink: 0,
        }}>
          {crop.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <h4 style={{
                fontSize: 16, fontWeight: 800, color: '#2d3a1e',
                fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
              }}>
                {crop.name}
                {lang === 'kn' && cropDatabase[crop.name]?.nameKn && (
                  <span style={{ fontSize: 14, color: '#718355', fontWeight: 600, marginLeft: 8 }}>
                    ({cropDatabase[crop.name].nameKn})
                  </span>
                )}
              </h4>
            </div>
            <RiskBadge level={riskLevel}/>
          </div>

          {/* Suitability bar */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#97a97c', fontWeight: 600 }}>
                {lang === 'kn' ? 'ಸೂಕ್ತತೆ' : 'Suitability'}
              </span>
              <span style={{ fontSize: 14, fontWeight: 800, color: isTop ? '#718355' : '#4a5c33' }}>
                {crop.suitability}%
              </span>
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-fill" style={{
                width: `${crop.suitability}%`,
                background: `linear-gradient(90deg, ${
                  crop.suitability >= 75 ? '#97a97c, #4a9c4e' :
                  crop.suitability >= 55 ? '#f0a034, #c8872a' : '#f87171, #dc4c3c'
                })`,
              }}/>
            </div>
          </div>

          {/* Details row */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: '💧', value: crop.waterReq || 'Medium' },
              { label: '⏱', value: crop.duration || '90d' },
              { label: '🗓', value: crop.season || 'Kharif' },
            ].map(({ label, value }) => (
              <span key={label} style={{
                fontSize: 11, background: 'rgba(207,225,185,0.4)',
                borderRadius: 8, padding: '3px 8px', color: '#4a5c33', fontWeight: 500,
              }}>
                {label} {value}
              </span>
            ))}
            {crop.nFixation && (
              <span style={{
                fontSize: 11, background: 'rgba(76,175,80,0.12)',
                borderRadius: 8, padding: '3px 8px', color: '#2e7d32', fontWeight: 600,
              }}>
                🌿 N-Fix
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RecommendationsTab() {
  const { recommendations, farmInputs, lang, setActiveTab } = useApp();

  if (!recommendations) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>🌱</div>
        <h3 style={{
          fontSize: 20, fontWeight: 800, color: '#2d3a1e', marginBottom: 12,
          fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
        }}>
          {lang === 'kn' ? 'ಮೊದಲು ಬೆಳೆ ಮಾಹಿತಿ ನಮೂದಿಸಿ' : 'Enter crop info first'}
        </h3>
        <p style={{ fontSize: 15, color: '#97a97c', marginBottom: 24,
          fontFamily: "'Noto Sans Kannada', sans-serif" }}>
          {lang === 'kn'
            ? '"ಬೆಳೆ ಇತಿಹಾಸ" ಟ್ಯಾಬ್‌ಗೆ ಹೋಗಿ ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು "ಈಗ ವಿಶ್ಲೇಷಿಸಿ" ಒತ್ತಿ.'
            : 'Go to "Crop History" tab, select your current crop and click "Analyze Now".'}
        </p>
        <button
          className="btn-primary"
          onClick={() => setActiveTab('cropHistory')}
        >
          {lang === 'kn' ? 'ಬೆಳೆ ಇತಿಹಾಸ ನಮೂದಿಸಿ →' : 'Enter Crop History →'}
        </button>
      </div>
    );
  }

  const { topCrops, deficiencies, soilHealthScore, recoveryDays } = recommendations;
  const bestCrop = topCrops[0];

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Summary banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4a5c33, #718355)',
        borderRadius: 20, padding: '24px',
        color: 'white', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
          }}>
            {bestCrop?.icon}
          </div>
          <div>
            <p style={{ fontSize: 12, opacity: 0.8 }}>
              {lang === 'kn' ? 'ಮುಂದಿನ ಉತ್ತಮ ಬೆಳೆ' : 'Best Next Crop'}
            </p>
            <h3 style={{ fontSize: 22, fontWeight: 800 }}>
              {bestCrop?.name}
              {lang === 'kn' && cropDatabase[bestCrop?.name]?.nameKn
                ? ` (${cropDatabase[bestCrop.name].nameKn})` : ''}
            </h3>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <p style={{ fontSize: 28, fontWeight: 900 }}>{bestCrop?.suitability}%</p>
            <p style={{ fontSize: 12, opacity: 0.8 }}>
              {lang === 'kn' ? 'ಸೂಕ್ತ' : 'suitable'}
            </p>
          </div>
        </div>

        {/* Current crop info */}
        <div style={{
          background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 16px',
          display: 'flex', gap: 20,
        }}>
          <div>
            <p style={{ fontSize: 11, opacity: 0.7 }}>{lang === 'kn' ? 'ಪ್ರಸ್ತುತ ಬೆಳೆ' : 'Current crop'}</p>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{farmInputs.currentCrop} {cropDatabase[farmInputs.currentCrop]?.icon}</p>
          </div>
          <div>
            <p style={{ fontSize: 11, opacity: 0.7 }}>{lang === 'kn' ? 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ' : 'Soil health'}</p>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{soilHealthScore}%</p>
          </div>
          {deficiencies.length > 0 && (
            <div>
              <p style={{ fontSize: 11, opacity: 0.7 }}>{lang === 'kn' ? 'ಕೊರತೆ' : 'Deficiency'}</p>
              <p style={{ fontSize: 14, fontWeight: 700 }}>{deficiencies.map(d => d.substring(0,1).toUpperCase()).join(', ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Deficiency warning */}
      {deficiencies.length > 0 && (
        <div style={{
          background: 'rgba(255,160,0,0.08)', border: '1px solid rgba(255,160,0,0.25)',
          borderRadius: 14, padding: '16px', marginBottom: 20,
          display: 'flex', gap: 12,
        }}>
          <AlertTriangle size={20} color="#ff9800" style={{ flexShrink: 0 }}/>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#8b5e10', marginBottom: 4,
              fontFamily: "'Noto Sans Kannada', sans-serif" }}>
              {lang === 'kn' ? 'ಪತ್ತೆಯಾದ ಸಮಸ್ಯೆ' : 'Detected Issues'}
            </p>
            <p style={{ fontSize: 13, color: '#8b5e10' }}>
              {deficiencies.map(d => {
                const names = { nitrogen: 'Nitrogen (N)', phosphorus: 'Phosphorus (P)', potassium: 'Potassium (K)' };
                return names[d] || d;
              }).join(', ')} {lang === 'kn' ? 'ಕೊರತೆ ಇದೆ' : 'deficiency detected'}.
              {' '}{lang === 'kn' ? 'ಗೊಬ್ಬರ ಸಲಹೆ ಟ್ಯಾಬ್ ನೋಡಿ.' : 'Check Fertilizer tab.'}
            </p>
          </div>
        </div>
      )}

      {/* Crops list */}
      <h3 style={{
        fontSize: 16, fontWeight: 700, color: '#2d3a1e', marginBottom: 16,
        fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
      }}>
        🌾 {lang === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆಗಳು' : 'Recommended Crops'}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {topCrops.map((crop, i) => (
          <div key={crop.name} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
            <CropCard crop={crop} rank={i + 1} lang={lang}/>
          </div>
        ))}
      </div>

      {/* Recovery note */}
      <div className="glass-card" style={{ padding: '20px', marginTop: 24 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Info size={20} color="#2980b9" style={{ flexShrink: 0, marginTop: 2 }}/>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1a5276', marginBottom: 4,
              fontFamily: "'Noto Sans Kannada', sans-serif" }}>
              {lang === 'kn' ? 'ಮಣ್ಣು ಚೇತರಿಕೆ' : 'Soil Recovery'}
            </p>
            <p style={{ fontSize: 13, color: '#2471a3', lineHeight: 1.6 }}>
              {lang === 'kn'
                ? `ಮಣ್ಣು ಚೇತರಿಕೆಗೆ ಸುಮಾರು ${recoveryDays} ದಿನಗಳು ಬೇಕಾಗುತ್ತದೆ. ಗೊಬ್ಬರ ಮತ್ತು ಕಾಂಪೋಸ್ಟ್ ಬಳಸಿ ಈ ಅವಧಿ ಕಡಿಮೆ ಮಾಡಬಹುದು.`
                : `Estimated soil recovery time: ~${recoveryDays} days. Using fertilizers and compost can reduce this timeline significantly.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
