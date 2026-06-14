import { createContext, useContext, useState, useCallback } from 'react';
import { translations, karnatakaSoilDB, cropDatabase } from '../data/bhoomiData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('kn');
  const [screen, setScreen] = useState('splash'); // splash | home | otp | gps | app
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);

  // Auth state
  const [mobile, setMobile] = useState('');
  const [farmer, setFarmer] = useState(null);

  // Location + soil state
  const [location, setLocation] = useState(null);
  const [soilData, setSoilData] = useState(null);

  // Farm inputs
  const [farmInputs, setFarmInputs] = useState({
    currentCrop: '',
    previousCrop: '',
    cropCycle: '1',
    landArea: '',
    farmName: '',
    season: 'kharif',
  });

  // Recommendations
  const [recommendations, setRecommendations] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Chatbot
  const [chatMessages, setChatMessages] = useState([]);

  const t = (key) => translations[lang]?.[key] || key;

  const detectSoilFromLocation = useCallback((lat, lon) => {
    // Simulate GIS lookup - in production this would call a real API
    const districts = {
      'Mandya': { lat: [12.3, 12.8], lon: [76.5, 77.2] },
      'Mysuru': { lat: [11.9, 12.6], lon: [76.3, 77.0] },
      'Belagavi': { lat: [15.5, 16.5], lon: [74.0, 75.5] },
      'Dharwad': { lat: [15.0, 15.8], lon: [74.8, 75.8] },
      'Raichur': { lat: [15.8, 16.8], lon: [76.5, 77.8] },
      'Bengaluru Rural': { lat: [12.8, 13.5], lon: [77.0, 77.8] },
      'Uttara Kannada': { lat: [14.2, 15.2], lon: [74.0, 75.2] },
      'Tumakuru': { lat: [13.0, 14.0], lon: [76.5, 77.5] },
    };

    let matchedDistrict = 'Mandya';
    for (const [district, range] of Object.entries(districts)) {
      if (lat >= range.lat[0] && lat <= range.lat[1] && lon >= range.lon[0] && lon <= range.lon[1]) {
        matchedDistrict = district;
        break;
      }
    }

    const soilEntry = karnatakaSoilDB.find(s =>
      s.districts.some(d => d.toLowerCase().includes(matchedDistrict.toLowerCase()))
    ) || karnatakaSoilDB[0];

    const confidence = Math.floor(Math.random() * 15) + 80; // 80-95%

    return {
      district: matchedDistrict,
      state: 'Karnataka',
      lat: lat.toFixed(4),
      lon: lon.toFixed(4),
      soilType: soilEntry.soilType,
      soilTypeKn: soilEntry.soilTypeKn,
      soilColor: soilEntry.color,
      npk: { ...soilEntry.npk },
      confidence,
      commonCrops: soilEntry.commonCrops,
      description: soilEntry.description,
    };
  }, []);

  const runAnalysis = useCallback(() => {
    if (!soilData || !farmInputs.currentCrop) return;
    setAnalysisLoading(true);

    setTimeout(() => {
      const cycleNum = parseInt(farmInputs.cropCycle, 10) || 1;
      const cycleMultiplier = Math.min(cycleNum, 5) * 0.15; // each extra cycle adds 15% more depletion
      const crop = cropDatabase[farmInputs.currentCrop];
      const prevCrop = cropDatabase[farmInputs.previousCrop];

      // Compute depleted NPK
      let depleted = { n: 0, p: 0, k: 0 };
      if (crop) {
        depleted.n += crop.depletionRate.n * (1 + cycleMultiplier);
        depleted.p += crop.depletionRate.p * (1 + cycleMultiplier);
        depleted.k += crop.depletionRate.k * (1 + cycleMultiplier);
      }
      if (prevCrop) {
        depleted.n += prevCrop.depletionRate.n * 0.5;
        depleted.p += prevCrop.depletionRate.p * 0.5;
        depleted.k += prevCrop.depletionRate.k * 0.5;
      }

      const adjustedNPK = {
        n: Math.max(10, soilData.npk.n - depleted.n),
        p: Math.max(10, soilData.npk.p - depleted.p),
        k: Math.max(10, soilData.npk.k - depleted.k),
      };

      // Compute soil health
      const maxNPK = 100;
      const soilHealthScore = Math.floor(
        (adjustedNPK.n / maxNPK) * 40 +
        (adjustedNPK.p / maxNPK) * 30 +
        (adjustedNPK.k / maxNPK) * 30
      );

      // Generate crop recommendations
      const allCrops = Object.entries(cropDatabase).filter(([name]) => name !== farmInputs.currentCrop);
      const scored = allCrops.map(([name, data]) => {
        let score = 100;
        if (data.npkDemand.n === 'high' && adjustedNPK.n < 35) score -= 30;
        if (data.npkDemand.n === 'low' || data.nFixation) score += 15;
        if (data.waterReq === 'Low' && soilData.npk.k < 50) score += 10;
        if (data.npkDemand.p === 'high' && adjustedNPK.p < 30) score -= 20;
        score = Math.min(98, Math.max(20, score + Math.floor(Math.random() * 10)));
        return { name, ...data, suitability: score };
      });

      scored.sort((a, b) => b.suitability - a.suitability);
      const topCrops = scored.slice(0, 5);

      // Detect deficiencies
      const deficiencies = [];
      if (adjustedNPK.n < 40) deficiencies.push('nitrogen');
      if (adjustedNPK.p < 35) deficiencies.push('phosphorus');
      if (adjustedNPK.k < 50) deficiencies.push('potassium');

      // Recovery time
      const recoveryDays = deficiencies.length * 15 + 15;

      setRecommendations({
        adjustedNPK,
        soilHealthScore,
        topCrops,
        deficiencies,
        recoveryDays,
        depleted,
      });

      setAnalysisLoading(false);
    }, 2500);
  }, [soilData, farmInputs]);

  const value = {
    lang, setLang,
    screen, setScreen,
    activeTab, setActiveTab,
    isAdmin, setIsAdmin,
    mobile, setMobile,
    farmer, setFarmer,
    location, setLocation,
    soilData, setSoilData,
    farmInputs, setFarmInputs,
    recommendations, setRecommendations,
    analysisLoading,
    chatMessages, setChatMessages,
    t,
    detectSoilFromLocation,
    runAnalysis,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
