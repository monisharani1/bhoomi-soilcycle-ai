import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cropDatabase } from '../data/bhoomiData';
import { Sprout, RefreshCw } from 'lucide-react';

const seasons = [
  { value: 'kharif', label: 'Kharif (Jun–Oct)', labelKn: 'ಖರೀಫ್ (ಜೂನ್–ಅಕ್ಟೋ)' },
  { value: 'rabi', label: 'Rabi (Nov–Mar)', labelKn: 'ರಬಿ (ನವೆ–ಮಾರ್ಚ್)' },
  { value: 'summer', label: 'Summer (Mar–Jun)', labelKn: 'ಬೇಸಿಗೆ (ಮಾರ್ಚ್–ಜೂನ್)' },
];

const cycles = [
  { value: 'first', enLabel: 'First Crop', knLabel: 'ಮೊದಲ ಬೆಳೆ' },
  { value: 'second', enLabel: 'Second Crop', knLabel: 'ಎರಡನೆಯ ಬೆಳೆ' },
  { value: 'third', enLabel: 'Third Crop', knLabel: 'ಮೂರನೆಯ ಬೆಳೆ' },
];

export default function CropHistoryTab() {
  const { lang, farmInputs, setFarmInputs, soilData, runAnalysis, analysisLoading, t } = useApp();
  const [saved, setSaved] = useState(false);

  const cropNames = Object.keys(cropDatabase);

  const handleChange = (key, value) => {
    setFarmInputs(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleAnalyze = () => {
    setSaved(true);
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
    <div style={{ paddingBottom: 32 }}>
      {/* Soil info banner */}
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
          <div>
            <p style={{ fontSize: 13, color: '#718355', fontWeight: 600 }}>
              📍 {soilData.district}, {soilData.state}
            </p>
            <p style={{ fontSize: 15, color: '#2d3a1e', fontWeight: 700,
              fontFamily: "'Noto Sans Kannada', sans-serif" }}>
              {lang === 'kn' ? soilData.soilTypeKn : soilData.soilType}
            </p>
            <p style={{ fontSize: 12, color: '#97a97c' }}>{soilData.confidence}% confidence</p>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: '28px' }}>
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

        {/* Crop cycle */}
        <div style={{ marginBottom: 18 }}>
          <label className="form-label">{lang === 'kn' ? 'ಬೆಳೆ ಚಕ್ರ' : 'Crop Cycle'}</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {cycles.map(c => (
              <button
                key={c.value}
                id={`cycle-${c.value}`}
                onClick={() => handleChange('cropCycle', c.value)}
                style={{
                  flex: 1, padding: '12px 8px', borderRadius: 12,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: '2px solid',
                  borderColor: farmInputs.cropCycle === c.value ? '#718355' : '#cfe1b9',
                  background: farmInputs.cropCycle === c.value
                    ? 'linear-gradient(135deg, rgba(113,131,85,0.15), rgba(74,92,51,0.1))'
                    : 'white',
                  color: farmInputs.cropCycle === c.value ? '#4a5c33' : '#97a97c',
                  transition: 'all 0.2s',
                  fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
                }}
              >
                {lang === 'kn' ? c.knLabel : c.enLabel}
              </button>
            ))}
          </div>
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
        <div style={{ marginBottom: 28 }}>
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

        {/* Crop preview */}
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

        {saved && !analysisLoading && (
          <p style={{ textAlign: 'center', color: '#4caf50', fontSize: 13, marginTop: 12, fontWeight: 600 }}>
            ✅ {lang === 'kn' ? 'ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ!' : 'Analysis complete! Check Recommendations tab.'}
          </p>
        )}
      </div>
    </div>
  );
}
