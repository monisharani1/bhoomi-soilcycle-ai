import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cropDatabase } from '../data/bhoomiData';
import { Sprout, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// ─── Inline Recommendations (merged) ─────────────────────────────────────────
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
      borderRadius: 16,
      border: isTop ? '2px solid #718355' : '1px solid rgba(207,225,185,0.6)',
      background: isTop
        ? 'linear-gradient(135deg, rgba(113,131,85,0.08), rgba(74,92,51,0.05))'
        : 'white',
      padding: '18px',
      position: 'relative',
      transition: 'all 0.3s',
      boxShadow: isTop ? '0 8px 24px rgba(74,92,51,0.15)' : '0 2px 8px rgba(74,92,51,0.06)',
    }}>
      {isTop && (
        <div style={{
          position: 'absolute', top: -11, left: 16,
          background: 'linear-gradient(135deg, #718355, #4a5c33)',
          color: 'white', fontSize: 11, fontWeight: 700,
          padding: '3px 10px', borderRadius: 20,
          boxShadow: '0 4px 12px rgba(113,131,85,0.4)',
        }}>
          ⭐ {lang === 'kn' ? 'ಅತ್ಯುತ್ತಮ' : 'Best Choice'}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: isTop ? 'linear-gradient(135deg, #718355, #4a5c33)' : 'rgba(233,245,219,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, flexShrink: 0,
        }}>
          {crop.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#2d3a1e',
              fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif" }}>
              {crop.name}
              {lang === 'kn' && cropDatabase[crop.name]?.nameKn
                ? <span style={{ fontSize: 12, color: '#718355', fontWeight: 600, marginLeft: 6 }}>
                    ({cropDatabase[crop.name].nameKn})
                  </span>
                : null}
            </p>
            <RiskBadge level={riskLevel}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="progress-bar" style={{ flex: 1, height: 7 }}>
              <div className="progress-fill" style={{
                width: `${crop.suitability}%`,
                background: `linear-gradient(90deg, ${
                  crop.suitability >= 75 ? '#97a97c, #4a9c4e' :
                  crop.suitability >= 55 ? '#f0a034, #c8872a' : '#f87171, #dc4c3c'
                })`,
              }}/>
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#4a5c33', minWidth: 36 }}>
              {crop.suitability}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Seasons ──────────────────────────────────────────────────────────────────
const seasons = [
  { value: 'kharif', label: 'Kharif (Jun–Oct)', labelKn: 'ಖರೀಫ್ (ಜೂನ್–ಅಕ್ಟೋ)' },
  { value: 'rabi', label: 'Rabi (Nov–Mar)', labelKn: 'ರಬಿ (ನವೆ–ಮಾರ್ಚ್)' },
  { value: 'summer', label: 'Summer (Mar–Jun)', labelKn: 'ಬೇಸಿಗೆ (ಮಾರ್ಚ್–ಜೂನ್)' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AnalysisTab() {
  const { lang, farmInputs, setFarmInputs, soilData, runAnalysis, analysisLoading, recommendations, t } = useApp();
  const [analysisTriggered, setAnalysisTriggered] = useState(false);

  const cropNames = Object.keys(cropDatabase);

  const handleChange = (key, value) => {
    setFarmInputs(prev => ({ ...prev, [key]: value }));
    setAnalysisTriggered(false);
  };

  const handleAnalyze = () => {
    setAnalysisTriggered(true);
    runAnalysis();
  };

  const SelectWrapper = ({ label, children }) => (
    <div style={{ marginBottom: 18 }}>
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        {children}
        <div style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none', color: '#718355',
        }}>▾</div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 40 }}>

      {/* ── Soil Detection Banner ── */}
      {soilData && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(113,131,85,0.12), rgba(74,92,51,0.08))',
          borderRadius: 16, padding: '16px 20px', marginBottom: 24,
          border: '1px solid rgba(181,201,154,0.5)',
          display: 'flex', gap: 14, alignItems: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: soilData.soilColor || '#c8722a',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            flexShrink: 0,
          }}/>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: '#718355', fontWeight: 600 }}>
              📍 {soilData.district}, {soilData.state}
            </p>
            <p style={{ fontSize: 15, color: '#2d3a1e', fontWeight: 700,
              fontFamily: "'Noto Sans Kannada', sans-serif" }}>
              {lang === 'kn' ? soilData.soilTypeKn : soilData.soilType}
            </p>
          </div>
          <span style={{
            background: 'rgba(113,131,85,0.15)', borderRadius: 20,
            padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#4a5c33',
          }}>
            {soilData.confidence}% ✓
          </span>
        </div>
      )}

      {/* ── Crop Information Form ── */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#2d3a1e', marginBottom: 24,
          fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif" }}>
          🌱 {lang === 'kn' ? 'ಬೆಳೆ ಮಾಹಿತಿ' : 'Crop Information'}
        </h3>

        {/* Farm name */}
        <div style={{ marginBottom: 18 }}>
          <label className="form-label">{lang === 'kn' ? 'ಜಮೀನಿನ ಹೆಸರು' : 'Farm Name'}</label>
          <input
            id="farm-name"
            type="text"
            className="input-field"
            placeholder={lang === 'kn' ? 'ಉದಾ: ಮಾರಣ್ಣ ಜಮೀನು' : 'e.g. My Farm Field'}
            value={farmInputs.farmName}
            onChange={e => handleChange('farmName', e.target.value)}
          />
        </div>

        {/* Current crop */}
        <SelectWrapper label={lang === 'kn' ? 'ಪ್ರಸ್ತುತ ಬೆಳೆ *' : 'Current Crop *'}>
          <select
            id="current-crop"
            className="select-field"
            value={farmInputs.currentCrop}
            onChange={e => handleChange('currentCrop', e.target.value)}
          >
            <option value="">{lang === 'kn' ? '-- ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ --' : '-- Select Crop --'}</option>
            {cropNames.map(crop => (
              <option key={crop} value={crop}>
                {cropDatabase[crop].icon} {lang === 'kn' ? `${crop} (${cropDatabase[crop].nameKn})` : crop}
              </option>
            ))}
          </select>
        </SelectWrapper>

        {/* Previous crop */}
        <SelectWrapper label={lang === 'kn' ? 'ಹಿಂದಿನ ಬೆಳೆ' : 'Previous Crop'}>
          <select
            id="prev-crop"
            className="select-field"
            value={farmInputs.previousCrop}
            onChange={e => handleChange('previousCrop', e.target.value)}
          >
            <option value="">{lang === 'kn' ? '-- ಆಯ್ಕೆಮಾಡಿ --' : '-- Select --'}</option>
            {cropNames.map(crop => (
              <option key={crop} value={crop}>
                {cropDatabase[crop].icon} {lang === 'kn' ? `${crop} (${cropDatabase[crop].nameKn})` : crop}
              </option>
            ))}
          </select>
        </SelectWrapper>

        {/* Crop cycle — number input */}
        <div style={{ marginBottom: 18 }}>
          <label className="form-label">{lang === 'kn' ? 'ಬೆಳೆ ಚಕ್ರ ಸಂಖ್ಯೆ' : 'Crop Cycle Number'}</label>
          <input
            id="crop-cycle-number"
            type="number"
            className="input-field"
            placeholder={lang === 'kn' ? 'ಉದಾ: 1, 2, 3...' : 'e.g. 1, 2, 3...'}
            value={farmInputs.cropCycle}
            onChange={e => handleChange('cropCycle', e.target.value)}
            min="1"
            max="20"
            step="1"
            style={{ width: '100%' }}
          />
          <p style={{ fontSize: 11, color: '#97a97c', marginTop: 4 }}>
            {lang === 'kn'
              ? 'ಈ ಜಮೀನಿನಲ್ಲಿ ಇದು ಎಷ್ಟನೇ ಬೆಳೆ?'
              : 'Which cycle number is this crop on this land?'}
          </p>
        </div>

        {/* Season */}
        <SelectWrapper label={lang === 'kn' ? 'ಋತು' : 'Season'}>
          <select
            id="season-select"
            className="select-field"
            value={farmInputs.season}
            onChange={e => handleChange('season', e.target.value)}
          >
            {seasons.map(s => (
              <option key={s.value} value={s.value}>
                {lang === 'kn' ? s.labelKn : s.label}
              </option>
            ))}
          </select>
        </SelectWrapper>

        {/* Land area */}
        <div style={{ marginBottom: 24 }}>
          <label className="form-label">{lang === 'kn' ? 'ಭೂ ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)' : 'Land Area (acres)'}</label>
          <input
            id="land-area"
            type="number"
            className="input-field"
            placeholder={lang === 'kn' ? 'ಉದಾ: 2.5' : 'e.g. 2.5'}
            value={farmInputs.landArea}
            onChange={e => handleChange('landArea', e.target.value)}
            min="0.1" step="0.5"
          />
        </div>

        {/* Current crop preview */}
        {farmInputs.currentCrop && cropDatabase[farmInputs.currentCrop] && (
          <div style={{
            background: 'rgba(233,245,219,0.7)', borderRadius: 14,
            padding: '16px', marginBottom: 24,
            border: '1px solid rgba(181,201,154,0.5)',
          }}>
            <p style={{ fontSize: 12, color: '#718355', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' }}>
              {lang === 'kn' ? 'ಬೆಳೆ ವಿವರ' : 'Crop Details'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['💧 Water Req.', cropDatabase[farmInputs.currentCrop].waterReq],
                ['⏱ Duration', cropDatabase[farmInputs.currentCrop].duration],
                ['🌱 Season', cropDatabase[farmInputs.currentCrop].season],
                ['📉 N Depletion', `${cropDatabase[farmInputs.currentCrop].depletionRate.n}%`],
              ].map(([label, value]) => (
                <div key={label} style={{ background: 'white', borderRadius: 10, padding: '10px 12px' }}>
                  <p style={{ fontSize: 11, color: '#97a97c' }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#2d3a1e' }}>{value}</p>
                </div>
              ))}
            </div>
            {cropDatabase[farmInputs.currentCrop].nFixation && (
              <div className="badge badge-green" style={{ marginTop: 10, fontSize: 12 }}>
                ✅ {lang === 'kn' ? 'ಸಾರಜನಕ ನಿಗದಿ ಬೆಳೆ' : 'Nitrogen-fixing crop'}
              </div>
            )}
          </div>
        )}

        {/* Analyze button */}
        <button
          id="analyze-btn"
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 16 }}
          onClick={handleAnalyze}
          disabled={!farmInputs.currentCrop || analysisLoading}
        >
          {analysisLoading
            ? <><RefreshCw size={18} style={{ animation: 'spin-slow 1s linear infinite' }}/> {lang === 'kn' ? 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...' : 'Analyzing...'}</>
            : <><Sprout size={18}/> {t('analyzeNow')}</>}
        </button>
      </div>

      {/* ── Loading shimmer ── */}
      {analysisLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3].map(i => (
            <div key={i} className="shimmer" style={{ height: 80, borderRadius: 16 }}/>
          ))}
        </div>
      )}

      {/* ── Recommendations (shown after analysis) ── */}
      {recommendations && !analysisLoading && (
        <div className="animate-fade-in">

          {/* Summary banner */}
          <div style={{
            background: 'linear-gradient(135deg, #4a5c33, #718355)',
            borderRadius: 20, padding: '24px',
            color: 'white', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
              }}>
                {recommendations.topCrops[0]?.icon}
              </div>
              <div>
                <p style={{ fontSize: 12, opacity: 0.8 }}>
                  {lang === 'kn' ? 'ಮುಂದಿನ ಉತ್ತಮ ಬೆಳೆ' : 'Best Next Crop'}
                </p>
                <h3 style={{ fontSize: 22, fontWeight: 800 }}>
                  {recommendations.topCrops[0]?.name}
                  {lang === 'kn' && cropDatabase[recommendations.topCrops[0]?.name]?.nameKn
                    ? ` (${cropDatabase[recommendations.topCrops[0].name].nameKn})` : ''}
                </h3>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <p style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>
                  {recommendations.topCrops[0]?.suitability}%
                </p>
                <p style={{ fontSize: 12, opacity: 0.8 }}>
                  {lang === 'kn' ? 'ಸೂಕ್ತ' : 'suitable'}
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 16px',
              display: 'flex', gap: 20,
            }}>
              <div>
                <p style={{ fontSize: 11, opacity: 0.7 }}>{lang === 'kn' ? 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ' : 'Soil health'}</p>
                <p style={{ fontSize: 15, fontWeight: 700 }}>{recommendations.soilHealthScore}%</p>
              </div>
              {recommendations.deficiencies.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, opacity: 0.7 }}>{lang === 'kn' ? 'ಕೊರತೆ' : 'Deficiency'}</p>
                  <p style={{ fontSize: 15, fontWeight: 700 }}>
                    {recommendations.deficiencies.map(d => d.substring(0,1).toUpperCase()).join(', ')}
                  </p>
                </div>
              )}
              <div>
                <p style={{ fontSize: 11, opacity: 0.7 }}>{lang === 'kn' ? 'ಚೇತರಿಕೆ' : 'Recovery'}</p>
                <p style={{ fontSize: 15, fontWeight: 700 }}>{recommendations.recoveryDays} days</p>
              </div>
            </div>
          </div>

          {/* Deficiency alert */}
          {recommendations.deficiencies.length > 0 && (
            <div style={{
              background: 'rgba(255,160,0,0.08)', border: '1px solid rgba(255,160,0,0.25)',
              borderRadius: 14, padding: '16px', marginBottom: 16,
              display: 'flex', gap: 12,
            }}>
              <AlertTriangle size={20} color="#ff9800" style={{ flexShrink: 0 }}/>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#8b5e10', marginBottom: 4 }}>
                  {lang === 'kn' ? 'ಪೋಷಕಾಂಶ ಕೊರತೆ ಪತ್ತೆಯಾಗಿದೆ' : 'Nutrient Deficiency Detected'}
                </p>
                <p style={{ fontSize: 13, color: '#8b5e10' }}>
                  {recommendations.deficiencies.map(d => {
                    const n = { nitrogen: 'Nitrogen (N)', phosphorus: 'Phosphorus (P)', potassium: 'Potassium (K)' };
                    return n[d] || d;
                  }).join(', ')}.
                  {' '}{lang === 'kn' ? 'ಗೊಬ್ಬರ ಸಲಹೆ ಟ್ಯಾಬ್ ನೋಡಿ.' : 'Check Fertilizer tab for solutions.'}
                </p>
              </div>
            </div>
          )}

          {/* Crop list */}
          <h3 style={{
            fontSize: 16, fontWeight: 700, color: '#2d3a1e', marginBottom: 14,
            fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
          }}>
            🌾 {lang === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆಗಳು' : 'Recommended Crops'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {recommendations.topCrops.map((crop, i) => (
              <div key={crop.name} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <CropCard crop={crop} rank={i + 1} lang={lang}/>
              </div>
            ))}
          </div>

          {/* Recovery note */}
          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Info size={18} color="#2980b9" style={{ flexShrink: 0, marginTop: 2 }}/>
              <p style={{ fontSize: 13, color: '#2471a3', lineHeight: 1.6 }}>
                {lang === 'kn'
                  ? `ಮಣ್ಣು ಚೇತರಿಕೆಗೆ ಸುಮಾರು ${recommendations.recoveryDays} ದಿನಗಳು ಬೇಕು. ಗೊಬ್ಬರ ಮತ್ತು ಕಾಂಪೋಸ್ಟ್ ಬಳಸಿ ಈ ಅವಧಿ ಕಡಿಮೆ ಮಾಡಬಹುದು.`
                  : `Estimated soil recovery: ~${recommendations.recoveryDays} days. Using fertilizers and compost can speed up recovery.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
