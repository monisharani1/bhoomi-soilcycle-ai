import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { karnatakaSoilDB, cropDatabase } from '../data/bhoomiData';
import { Users, Leaf, Activity, Map, Settings, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';

const mockFarmers = [
  { id: 'F001', name: 'Ramu Gowda', taluk: 'Mandya', crop: 'Rice', lastActive: '2h ago', health: 62 },
  { id: 'F002', name: 'Lakshmi Devi', taluk: 'Maddur', crop: 'Sugarcane', lastActive: '1d ago', health: 78 },
  { id: 'F003', name: 'Basavaraj', taluk: 'Malavalli', crop: 'Ragi', lastActive: '3h ago', health: 55 },
  { id: 'F004', name: 'Savitri Bai', taluk: 'Srirangapatna', crop: 'Groundnut', lastActive: '5h ago', health: 44 },
  { id: 'F005', name: 'Rajanna', taluk: 'Nagamangala', crop: 'Maize', lastActive: '2d ago', health: 81 },
  { id: 'F006', name: 'Devamma', taluk: 'Pandavapura', crop: 'Rice', lastActive: '4h ago', health: 70 },
];

const soilTypeDist = [
  { name: 'Red Sandy Loam', value: 35, color: '#c8722a' },
  { name: 'Black Cotton', value: 28, color: '#3d2b1a' },
  { name: 'Alluvial Loam', value: 20, color: '#c4a05a' },
  { name: 'Laterite', value: 12, color: '#b54830' },
  { name: 'Coastal', value: 5, color: '#8b5e38' },
];

export default function AdminTab() {
  const { lang } = useApp();
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { key: 'overview', icon: <Activity size={16}/>, label: lang === 'kn' ? 'ಅವಲೋಕನ' : 'Overview' },
    { key: 'farmers', icon: <Users size={16}/>, label: lang === 'kn' ? 'ರೈತರು' : 'Farmers' },
    { key: 'soil', icon: <Map size={16}/>, label: lang === 'kn' ? 'ಮಣ್ಣು ಡೇಟಾ' : 'Soil DB' },
    { key: 'crops', icon: <Leaf size={16}/>, label: lang === 'kn' ? 'ಬೆಳೆ ಡೇಟಾ' : 'Crop DB' },
  ];

  const statCards = [
    { icon: <Users size={22}/>, label: lang === 'kn' ? 'ಮಂಡ್ಯ ರೈತರು' : 'Mandya Farmers', value: '1,240', change: '+62 this month', color: '#2980b9' },
    { icon: <Activity size={22}/>, label: lang === 'kn' ? 'ಸಕ್ರಿಯ ವಿಶ್ಲೇಷಣೆ' : 'Active Analyses', value: '487', change: '↑ 18% vs last month', color: '#718355' },
    { icon: <Map size={22}/>, label: lang === 'kn' ? 'ತಾಲ್ಲೂಕುಗಳು' : 'Taluks Covered', value: '7/7', change: lang === 'kn' ? 'ಎಲ್ಲಾ ತಾಲ್ಲೂಕುಗಳು' : 'All Mandya taluks', color: '#8b5e10' },
    { icon: <TrendingUp size={22}/>, label: lang === 'kn' ? 'ಸರಾಸರಿ ಆರೋಗ್ಯ' : 'Avg Soil Health', value: '71%', change: '↑ 5% improvement', color: '#6b4c2a' },
  ];

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2d3a1e, #4a5c33)',
        borderRadius: 20, padding: '24px', marginBottom: 24, color: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Settings size={24}/>
          <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>
            {lang === 'kn' ? 'ಆಡಳಿತ ಪ್ಯಾನೆಲ್' : 'Admin Panel'}
          </h2>
        </div>
        <p style={{ fontSize: 14, opacity: 0.75 }}>
          {lang === 'kn' ? 'ಭೂಮಿ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ನಿರ್ವಹಣೆ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ' : 'Bhoomi Platform Management & Analytics'}
        </p>
      </div>

      {/* Section tabs */}
      <div className="tab-scroll" style={{ marginBottom: 20 }}>
        {sections.map(s => (
          <button
            key={s.key}
            className={`tab-pill ${activeSection === s.key ? 'active' : 'inactive'}`}
            onClick={() => setActiveSection(s.key)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginBottom: 24 }}>
            {statCards.map((card, i) => (
              <div key={i} className="metric-card">
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: `${card.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: card.color, marginBottom: 12,
                }}>
                  {card.icon}
                </div>
                <p style={{ fontSize: 11, color: '#97a97c', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                  {card.label}
                </p>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#2d3a1e', marginBottom: 2 }}>{card.value}</p>
                <p style={{ fontSize: 11, color: '#97a97c' }}>{card.change}</p>
              </div>
            ))}
          </div>

          {/* Mandya focus note */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(113,131,85,0.1), rgba(74,92,51,0.06))',
            borderRadius: 14, padding: '16px 20px', marginBottom: 20,
            border: '1px solid rgba(181,201,154,0.4)',
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <span style={{ fontSize: 28 }}>📍</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#2d3a1e' }}>
                {lang === 'kn' ? 'ಮಂಡ್ಯ ಜಿಲ್ಲೆ — ಗಮನ ಕೇಂದ್ರ' : 'Mandya District — Primary Focus'}
              </p>
              <p style={{ fontSize: 12, color: '#718355' }}>
                {lang === 'kn'
                  ? '7 ತಾಲ್ಲೂಕುಗಳು: ಮಂಡ್ಯ, ಮದ್ದೂರು, ಮಳವಳ್ಳಿ, ಶ್ರೀರಂಗಪಟ್ಟಣ, ನಾಗಮಂಗಲ, ಪಾಂಡವಪುರ, ಕೃಷ್ಣರಾಜಪೇಟೆ'
                  : '7 Taluks: Mandya, Maddur, Malavalli, Srirangapatna, Nagamangala, Pandavapura, KR Pet'}
              </p>
            </div>
          </div>

          {/* Soil distribution pie */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3a1e', marginBottom: 16 }}>
              🗺️ {lang === 'kn' ? 'ಮಣ್ಣಿನ ಪ್ರಕಾರ ವಿತರಣೆ' : 'Soil Type Distribution'}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <PieChart width={130} height={130}>
                <Pie data={soilTypeDist} cx={65} cy={65} innerRadius={35} outerRadius={60} dataKey="value" paddingAngle={3}>
                  {soilTypeDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color}/>
                  ))}
                </Pie>
              </PieChart>
              <div style={{ flex: 1 }}>
                {soilTypeDist.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }}/>
                    <span style={{ fontSize: 12, color: '#4a5c33', flex: 1 }}>{s.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#2d3a1e' }}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === 'farmers' && (
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3a1e' }}>
              👨‍🌾 {lang === 'kn' ? 'ಮಂಡ್ಯ ರೈತರ ಪಟ್ಟಿ' : 'Mandya Farmer List'}
            </h3>
            <span className="badge badge-green">{mockFarmers.length} shown</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {mockFarmers.map((f, i) => (
              <div key={f.id} style={{
                padding: '14px 0',
                borderBottom: i < mockFarmers.length - 1 ? '1px solid rgba(207,225,185,0.4)' : 'none',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: `hsl(${i * 60},40%,75%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: 'white',
                }}>
                  {f.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#2d3a1e' }}>{f.name}</p>
                  <p style={{ fontSize: 12, color: '#97a97c' }}>
                    📍 {f.taluk}, Mandya • 🌾 {f.crop}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: 14, fontWeight: 800,
                    color: f.health >= 70 ? '#4caf50' : f.health >= 50 ? '#ff9800' : '#f44336',
                  }}>{f.health}%</p>
                  <p style={{ fontSize: 11, color: '#97a97c' }}>{f.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'soil' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {karnatakaSoilDB.map((soil, i) => (
            <div key={i} className="glass-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: soil.color, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}/>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#2d3a1e', marginBottom: 2 }}>{soil.soilType}</p>
                  <p style={{ fontSize: 12, color: '#97a97c', marginBottom: 8 }}>
                    {soil.districts.join(', ')}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className="badge badge-green">N: {soil.npk.n}</span>
                    <span className="badge badge-amber">P: {soil.npk.p}</span>
                    <span className="badge badge-blue">K: {soil.npk.k}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'crops' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {Object.entries(cropDatabase).map(([name, crop]) => (
            <div key={name} className="glass-card" style={{ padding: '16px' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{crop.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#2d3a1e', marginBottom: 2 }}>{name}</p>
              <p style={{ fontSize: 12, color: '#97a97c', marginBottom: 8, fontFamily: "'Noto Sans Kannada', sans-serif" }}>
                {crop.nameKn}
              </p>
              <div style={{ fontSize: 11, color: '#4a5c33' }}>
                💧 {crop.waterReq} • ⏱ {crop.duration}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
