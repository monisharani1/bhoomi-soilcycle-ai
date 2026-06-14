import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { fertilizerDB } from '../data/bhoomiData';
import { Leaf, FlaskConical, Clock, Scale } from 'lucide-react';

const FertCard = ({ fert, type, lang }) => (
  <div style={{
    background: type === 'chemical'
      ? 'rgba(41,128,185,0.06)'
      : 'rgba(76,175,80,0.06)',
    border: `1px solid ${type === 'chemical' ? 'rgba(41,128,185,0.2)' : 'rgba(76,175,80,0.2)'}`,
    borderRadius: 14, padding: '16px',
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#2d3a1e' }}>
          {lang === 'kn' && fert.nameKn ? fert.nameKn : fert.name}
        </p>
        {lang === 'kn' && fert.nameKn && (
          <p style={{ fontSize: 12, color: '#97a97c' }}>{fert.name}</p>
        )}
      </div>
      {fert.npk && (
        <span className="badge badge-blue" style={{ fontSize: 11, fontFamily: 'monospace' }}>{fert.npk}</span>
      )}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <Scale size={13} color="#97a97c"/>
        <span style={{ fontSize: 12, color: '#4a5c33' }}>{fert.qty}</span>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <Clock size={13} color="#97a97c"/>
        <span style={{ fontSize: 12, color: '#4a5c33' }}>{fert.timing}</span>
      </div>
    </div>
  </div>
);

export default function FertilizerTab() {
  const { recommendations, farmInputs, lang } = useApp();
  const [activeNutrient, setActiveNutrient] = useState('nitrogen');

  const deficiencies = recommendations?.deficiencies || [];
  const allNutrients = ['nitrogen', 'phosphorus', 'potassium'];

  const nutrientDisplay = {
    nitrogen: { label: lang === 'kn' ? 'ಸಾರಜನಕ (N)' : 'Nitrogen (N)', icon: '🟢', color: '#4caf50' },
    phosphorus: { label: lang === 'kn' ? 'ರಂಜಕ (P)' : 'Phosphorus (P)', icon: '🟠', color: '#ff9800' },
    potassium: { label: lang === 'kn' ? 'ಪೊಟ್ಯಾಷಿಯಂ (K)' : 'Potassium (K)', icon: '🟣', color: '#9c27b0' },
  };

  const npk = recommendations?.adjustedNPK || { n: 55, p: 48, k: 72 };
  const npkValues = { nitrogen: npk.n, phosphorus: npk.p, potassium: npk.k };

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4a5c33, #718355)',
        borderRadius: 20, padding: '24px', marginBottom: 24, color: 'white',
      }}>
        <h2 style={{
          fontSize: 22, fontWeight: 800, marginBottom: 8,
          fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
        }}>
          🧪 {lang === 'kn' ? 'ಗೊಬ್ಬರ ಶಿಫಾರಸು' : 'Fertilizer Guide'}
        </h2>
        <p style={{ fontSize: 14, opacity: 0.8, fontFamily: "'Noto Sans Kannada', sans-serif" }}>
          {lang === 'kn'
            ? 'ನಿಮ್ಮ ಮಣ್ಣಿನ ಪೋಷಕಾಂಶ ಕೊರತೆ ಆಧಾರಿತ ಶಿಫಾರಸುಗಳು'
            : 'Based on your soil nutrient analysis and crop requirements'}
        </p>

        {deficiencies.length > 0 ? (
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {deficiencies.map(d => (
              <span key={d} style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 20, padding: '4px 12px',
                fontSize: 12, fontWeight: 600,
              }}>
                ⚠️ {nutrientDisplay[d]?.label}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 14 }}>
            <span style={{
              background: 'rgba(76,175,80,0.3)', borderRadius: 20, padding: '4px 12px',
              fontSize: 12, fontWeight: 600,
            }}>
              ✅ {lang === 'kn' ? 'ಮಣ್ಣಿನ ಪೋಷಕಾಂಶ ಸಮತೋಲಿತ' : 'Soil nutrients are balanced'}
            </span>
          </div>
        )}
      </div>

      {/* NPK summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
        {allNutrients.map(n => {
          const isDeficient = deficiencies.includes(n);
          const val = npkValues[n];
          return (
            <div
              key={n}
              style={{
                borderRadius: 14, padding: '16px 12px', textAlign: 'center',
                background: isDeficient ? 'rgba(220,76,60,0.06)' : 'rgba(76,175,80,0.06)',
                border: `1.5px solid ${isDeficient ? 'rgba(220,76,60,0.2)' : 'rgba(76,175,80,0.2)'}`,
                cursor: 'pointer',
              }}
              onClick={() => setActiveNutrient(n)}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{nutrientDisplay[n].icon}</div>
              <p style={{ fontSize: 22, fontWeight: 900, color: isDeficient ? '#c0392b' : '#2d7a35',
                fontFamily: 'Inter' }}>{val.toFixed(0)}</p>
              <p style={{ fontSize: 10, color: '#97a97c', fontWeight: 600 }}>kg/ha</p>
              <p style={{ fontSize: 12, color: '#4a5c33', fontWeight: 700, marginTop: 4 }}>
                {n === 'nitrogen' ? 'N' : n === 'phosphorus' ? 'P' : 'K'}
              </p>
              {isDeficient && (
                <div className="badge badge-red" style={{ marginTop: 6, fontSize: 10 }}>Low</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nutrient selector tabs */}
      <div className="tab-scroll" style={{ marginBottom: 20 }}>
        {allNutrients.map(n => (
          <button
            key={n}
            className={`tab-pill ${activeNutrient === n ? 'active' : 'inactive'}`}
            onClick={() => setActiveNutrient(n)}
          >
            {nutrientDisplay[n].icon} {nutrientDisplay[n].label}
            {deficiencies.includes(n) && ' ⚠️'}
          </button>
        ))}
      </div>

      {/* Fertilizer recommendations */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <FlaskConical size={20} color="#718355"/>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2d3a1e',
            fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif" }}>
            {lang === 'kn' ? 'ರಾಸಾಯನಿಕ ಗೊಬ್ಬರಗಳು' : 'Chemical Fertilizers'}
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {fertilizerDB[activeNutrient].chemical.map((f, i) => (
            <FertCard key={i} fert={f} type="chemical" lang={lang}/>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Leaf size={20} color="#4caf50"/>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2d3a1e',
            fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif" }}>
            {lang === 'kn' ? 'ಸಾವಯವ ಪರ್ಯಾಯಗಳು' : 'Organic Alternatives'}
          </h3>
          <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: 11 }}>
            🌿 {lang === 'kn' ? 'ಉತ್ತಮ ಆಯ್ಕೆ' : 'Recommended'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {fertilizerDB[activeNutrient].organic.map((f, i) => (
            <FertCard key={i} fert={f} type="organic" lang={lang}/>
          ))}
        </div>
      </div>

      {/* Recovery timeline */}
      {recommendations && (
        <div className="glass-card" style={{ padding: '24px', marginTop: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2d3a1e', marginBottom: 16,
            fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif" }}>
            ⏱ {lang === 'kn' ? 'ಚೇತರಿಕೆ ಸಮಯ' : 'Recovery Timeline'}
          </h3>
          {[
            { label: lang === 'kn' ? '0-15 ದಿನ' : '0-15 days', action: lang === 'kn' ? 'ಗೊಬ್ಬರ ಹಾಕಿ' : 'Apply fertilizer', done: true },
            { label: lang === 'kn' ? '15-30 ದಿನ' : '15-30 days', action: lang === 'kn' ? 'ಹಸಿ ಗೊಬ್ಬರ ಸೇರಿಸಿ' : 'Add green manure', done: false },
            { label: lang === 'kn' ? '30+ ದಿನ' : '30+ days', action: lang === 'kn' ? 'ಬೆಳೆ ನೆಡಲು ಸಿದ್ಧ' : 'Ready for next crop', done: false },
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              paddingBottom: i < 2 ? 16 : 0,
              borderBottom: i < 2 ? '1px solid rgba(207,225,185,0.4)' : 'none',
              marginBottom: i < 2 ? 16 : 0,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: step.done ? 'linear-gradient(135deg, #4caf50, #2e7d32)' : 'rgba(207,225,185,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800,
                color: step.done ? 'white' : '#97a97c',
              }}>
                {step.done ? '✓' : i + 1}
              </div>
              <div>
                <p style={{ fontSize: 12, color: '#97a97c', fontWeight: 600 }}>{step.label}</p>
                <p style={{ fontSize: 14, color: '#2d3a1e', fontWeight: 600,
                  fontFamily: "'Noto Sans Kannada', sans-serif" }}>{step.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
