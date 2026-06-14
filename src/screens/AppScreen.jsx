import { useState } from 'react';
import { useApp } from '../context/AppContext';
import DashboardTab from '../tabs/DashboardTab';
import AnalysisTab from '../tabs/AnalysisTab';
import FertilizerTab from '../tabs/FertilizerTab';
import CropSearchTab from '../tabs/CropSearchTab';
import ChatbotTab from '../tabs/ChatbotTab';
import AdminTab from '../tabs/AdminTab';
import {
  LayoutDashboard, Sprout, FlaskConical,
  Search, Settings, MapPin, Menu, X, Leaf,
  LogOut, ChevronRight, X as Close
} from 'lucide-react';

// Tomato FAB SVG
const TomatoIcon = () => (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" width="34" height="34">
    {/* Leaves */}
    <path d="M28 12 Q22 6 16 10 Q20 16 28 15Z" fill="#4a8c3f"/>
    <path d="M28 12 Q34 6 40 10 Q36 16 28 15Z" fill="#5aaa4e"/>
    <path d="M28 12 Q26 4 28 2 Q30 4 28 12Z" fill="#3d7a34"/>
    {/* Tomato body */}
    <circle cx="28" cy="33" r="18" fill="url(#tomatoGrad)"/>
    {/* Shine */}
    <ellipse cx="22" cy="25" rx="5" ry="3.5" fill="rgba(255,255,255,0.3)" transform="rotate(-20 22 25)"/>
    <defs>
      <radialGradient id="tomatoGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ff7043"/>
        <stop offset="60%" stopColor="#e53935"/>
        <stop offset="100%" stopColor="#b71c1c"/>
      </radialGradient>
    </defs>
  </svg>
);

// Sidebar nav items — NO chatbot
const NAV_ITEMS = [
  { key: 'dashboard',  icon: <LayoutDashboard size={19}/>, en: 'Dashboard',      kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
  { key: 'analysis',   icon: <Sprout size={19}/>,          en: 'Analysis',        kn: 'ವಿಶ್ಲೇಷಣೆ' },
  { key: 'fertilizer', icon: <FlaskConical size={19}/>,    en: 'Fertilizer Guide', kn: 'ಗೊಬ್ಬರ ಸಲಹೆ' },
  { key: 'cropSearch', icon: <Search size={19}/>,          en: 'Crop Search',     kn: 'ಬೆಳೆ ಹುಡುಕಾಟ' },
  { key: 'admin',      icon: <Settings size={19}/>,        en: 'Admin Panel',     kn: 'ಆಡಳಿತ' },
];

const TAB_COMPONENTS = {
  dashboard:  DashboardTab,
  analysis:   AnalysisTab,
  fertilizer: FertilizerTab,
  cropSearch: CropSearchTab,
  admin:      AdminTab,
};

export default function AppScreen() {
  const { lang, setLang, activeTab, setActiveTab, soilData, farmer, setScreen } = useApp();
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [chatOpen,    setChatOpen]      = useState(false);

  const ActiveComponent = TAB_COMPONENTS[activeTab] || DashboardTab;
  const activeItem      = NAV_ITEMS.find(n => n.key === activeTab);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5faed' }}>

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>

        {/* Logo */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(207,225,185,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, #4a5c33, #718355)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(74,92,51,0.3)',
            }}>
              <Leaf size={22} color="#e9f5db"/>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Noto Sans Kannada','Poppins',sans-serif", fontSize: 20, fontWeight: 900, color: '#2d3a1e', lineHeight: 1 }}>
                ಭೂಮಿ
              </h1>
              <p style={{ fontSize: 10, color: '#97a97c', fontWeight: 600, letterSpacing: '1px' }}>BHOOMI</p>
            </div>
          </div>
        </div>

        {/* Location pill */}
        {soilData && (
          <div style={{ padding: '14px 16px' }}>
            <div style={{
              background: 'rgba(113,131,85,0.1)', borderRadius: 12, padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(181,201,154,0.4)',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <MapPin size={14} color="#718355"/>
                <div className="status-dot status-online"/>
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontSize: 11, color: '#718355', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {soilData.district}, {soilData.state}
                </p>
                <p style={{ fontSize: 10, color: '#97a97c', fontFamily: "'Noto Sans Kannada',sans-serif" }}>
                  {lang === 'kn' ? soilData.soilTypeKn : soilData.soilType}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: '#b5c99a',
            textTransform: 'uppercase', letterSpacing: '1.5px',
            padding: '8px 4px', marginBottom: 4,
          }}>
            {lang === 'kn' ? 'ಮುಖ್ಯ ಮೆನು' : 'Main Menu'}
          </p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              id={`nav-${item.key}`}
              className={`nav-link ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.key); if (window.innerWidth < 768) setSidebarOpen(false); }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontFamily: "'Noto Sans Kannada','Inter',sans-serif" }}>
                {lang === 'kn' ? item.kn : item.en}
              </span>
              {activeTab === item.key && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }}/>}
            </button>
          ))}
        </nav>

        {/* Bottom: lang + logout */}
        <div style={{ padding: '16px 16px 24px', borderTop: '1px solid rgba(207,225,185,0.4)' }}>
          <div className="lang-toggle" style={{ width: '100%', marginBottom: 12, justifyContent: 'center' }}>
            <button className={lang === 'kn' ? 'active-lang' : 'inactive-lang'} onClick={() => setLang('kn')} style={{ flex: 1, textAlign: 'center' }}>
              ಕನ್ನಡ
            </button>
            <button className={lang === 'en' ? 'active-lang' : 'inactive-lang'} onClick={() => setLang('en')} style={{ flex: 1, textAlign: 'center' }}>
              English
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'rgba(113,131,85,0.08)' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #97a97c, #718355)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 14, fontWeight: 700,
            }}>
              {farmer ? farmer.name?.[0] || 'F' : 'F'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{
                fontSize: 13, fontWeight: 700, color: '#2d3a1e',
                fontFamily: "'Noto Sans Kannada',sans-serif",
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {farmer ? (lang === 'kn' ? 'ರೈತ' : 'Farmer') : 'Demo User'}
              </p>
              <p style={{ fontSize: 11, color: '#97a97c' }}>
                {farmer?.mobile ? `+91 ${farmer.mobile}` : 'demo@bhoomi'}
              </p>
            </div>
            <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#97a97c', padding: 4 }}>
              <LogOut size={15}/>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className={`main-content ${!sidebarOpen ? 'main-content-full' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top nav */}
        <header className="top-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button id="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)} className="btn-ghost" style={{ padding: '8px' }}>
              {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#2d3a1e', fontFamily: "'Noto Sans Kannada','Inter',sans-serif" }}>
              {lang === 'kn' ? activeItem?.kn : activeItem?.en}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {soilData && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.2)' }}>
                <div className="status-dot status-online"/>
                <span style={{ fontSize: 12, color: '#2e7d32', fontWeight: 600 }}>GPS</span>
              </div>
            )}
          </div>
        </header>

        {/* Tab content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 0' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <ActiveComponent/>
          </div>
        </main>
      </div>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99, backdropFilter: 'blur(4px)',
        }}/>
      )}

      {/* ── Floating Tomato AI Button ── */}
      <button
        id="chat-fab"
        onClick={() => setChatOpen(true)}
        title={lang === 'kn' ? 'AI ಸಹಾಯಕ' : 'AI Assistant'}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 200,
          width: 64, height: 64, borderRadius: '50%',
          border: 'none', cursor: 'pointer',
          background: 'linear-gradient(145deg, #ff7043, #e53935)',
          boxShadow: '0 6px 24px rgba(229,57,53,0.45), 0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          animation: 'float 3s ease-in-out infinite',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.12)';
          e.currentTarget.style.boxShadow = '0 10px 32px rgba(229,57,53,0.6), 0 4px 12px rgba(0,0,0,0.25)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(229,57,53,0.45), 0 2px 8px rgba(0,0,0,0.2)';
        }}
      >
        <TomatoIcon/>
      </button>

      {/* Tooltip on FAB */}
      {!chatOpen && (
        <div style={{
          position: 'fixed', bottom: 100, right: 28, zIndex: 199,
          background: 'rgba(45,58,30,0.92)', color: '#e9f5db',
          fontSize: 12, fontWeight: 600,
          padding: '6px 12px', borderRadius: 20,
          fontFamily: "'Noto Sans Kannada','Inter',sans-serif",
          pointerEvents: 'none',
          animation: 'fadeIn 0.3s ease',
          whiteSpace: 'nowrap',
        }}>
          🤖 {lang === 'kn' ? 'AI ಸಹಾಯಕ' : 'AI Assistant'}
        </div>
      )}

      {/* ── Chatbot Modal Drawer ── */}
      {chatOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
          pointerEvents: 'none',
        }}>
          {/* Backdrop */}
          <div
            onClick={() => setChatOpen(false)}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(3px)',
              pointerEvents: 'all',
              animation: 'fadeIn 0.2s ease',
            }}
          />

          {/* Chat panel */}
          <div style={{
            position: 'relative', zIndex: 1,
            width: 420, height: '85vh',
            maxWidth: '100vw', maxHeight: '100vh',
            margin: '0 24px 24px 0',
            borderRadius: 24,
            background: '#f5faed',
            boxShadow: '0 24px 80px rgba(0,0,0,0.25), 0 4px 16px rgba(74,92,51,0.2)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            pointerEvents: 'all',
            animation: 'fadeInUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {/* Close button */}
            <button
              id="chat-close"
              onClick={() => setChatOpen(false)}
              style={{
                position: 'absolute', top: 14, right: 14, zIndex: 10,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.4)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#e9f5db',
                backdropFilter: 'blur(4px)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
            >
              <X size={16}/>
            </button>

            <ChatbotTab/>
          </div>
        </div>
      )}
    </div>
  );
}
