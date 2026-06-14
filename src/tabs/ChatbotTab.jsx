import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { chatbotResponses } from '../data/bhoomiData';
import { Send, Mic, RefreshCw, Bot } from 'lucide-react';

const QUICK_QUESTIONS = {
  kn: [
    'ಈ ಮಣ್ಣಿಗೆ ಯಾವ ಬೆಳೆ ಒಳ್ಳೆಯದು?',
    'ನೈಟ್ರೋಜನ್ ಕಡಿಮೆ ಯಾಕೆ?',
    'ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೇಗೆ ಹೆಚ್ಚಿಸಬಹುದು?',
    'ಮಳೆಗಾಲದಲ್ಲಿ ಯಾವ ಬೆಳೆ ಬೆಳೆಯಬೇಕು?',
  ],
  en: [
    'Which crop is best next?',
    'Why is nitrogen low?',
    'How to improve soil fertility?',
    'What crop for rainy season?',
  ],
};

const getResponse = (msg, lang, farmInputs, soilData) => {
  const m = msg.toLowerCase();
  const responses = chatbotResponses[lang];

  if (m.includes('nitrogen') || m.includes('ನೈಟ್ರೋಜನ್') || m.includes('n ') || m.includes('npk')) {
    return responses.nitrogen;
  }
  if (m.includes('next crop') || m.includes('recommend') || m.includes('ಯಾವ ಬೆಳೆ') || m.includes('ಮುಂದಿನ')) {
    return responses.nextCrop;
  }
  if (m.includes('fertil') || m.includes('soil') || m.includes('ಫಲವತ್ತ') || m.includes('ಮಣ್ಣು')) {
    return responses.soilFertility;
  }
  if (m.includes('weather') || m.includes('rain') || m.includes('ಮಳೆ') || m.includes('ಹವಾಮಾನ')) {
    return responses.weather;
  }
  return responses.default;
};

const TypingIndicator = () => (
  <div style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
    {[0,1,2].map(i => (
      <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }}/>
    ))}
  </div>
);

export default function ChatbotTab() {
  const { lang, setLang, farmInputs, soilData, chatMessages, setChatMessages, t } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([{
        id: 1,
        from: 'bot',
        text: chatbotResponses[lang].greeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      from: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const response = getResponse(text, lang, farmInputs, soilData);
      const botMsg = {
        id: Date.now() + 1,
        from: 'bot',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const clearChat = () => {
    setChatMessages([{
      id: Date.now(),
      from: 'bot',
      text: chatbotResponses[lang].greeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)' }}>
      {/* Chat header */}
      <div style={{
        background: 'linear-gradient(135deg, #4a5c33, #718355)',
        borderRadius: '16px 16px 0 0', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        marginBottom: 0,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Bot size={24} color="#e9f5db"/>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>
            {lang === 'kn' ? 'ಭೂಮಿ AI ಸಹಾಯಕ' : 'Bhoomi AI Assistant'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="status-dot status-online"/>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
              {lang === 'kn' ? 'ಸಕ್ರಿಯ' : 'Online'}
            </span>
          </div>
        </div>
        {/* Language switcher in chat */}
        <div className="lang-toggle" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <button
            className={lang === 'kn' ? 'active-lang' : 'inactive-lang'}
            style={{ color: lang === 'kn' ? 'white' : 'rgba(255,255,255,0.7)' }}
            onClick={() => setLang('kn')}
          >ಕನ್ನಡ</button>
          <button
            className={lang === 'en' ? 'active-lang' : 'inactive-lang'}
            style={{ color: lang === 'en' ? 'white' : 'rgba(255,255,255,0.7)' }}
            onClick={() => setLang('en')}
          >EN</button>
        </div>
        <button onClick={clearChat} style={{
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
          padding: '6px', cursor: 'pointer', color: 'white',
        }}>
          <RefreshCw size={16}/>
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 16px',
        background: 'rgba(245,250,237,0.8)',
        display: 'flex', flexDirection: 'column', gap: 16,
        borderLeft: '1px solid rgba(207,225,185,0.4)',
        borderRight: '1px solid rgba(207,225,185,0.4)',
      }}>
        {chatMessages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex',
            flexDirection: msg.from === 'bot' ? 'row' : 'row-reverse',
            gap: 10, alignItems: 'flex-end',
          }}>
            {msg.from === 'bot' && (
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #718355, #4a5c33)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={16} color="#e9f5db"/>
              </div>
            )}
            <div style={{ maxWidth: '80%' }}>
              <div className={msg.from === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}
                style={{ fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif" }}>
                {msg.text}
              </div>
              <p style={{
                fontSize: 10, color: '#97a97c', marginTop: 4,
                textAlign: msg.from === 'user' ? 'right' : 'left',
              }}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #718355, #4a5c33)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={16} color="#e9f5db"/>
            </div>
            <div className="chat-bubble-bot">
              <TypingIndicator/>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Quick questions */}
      <div style={{
        padding: '12px 16px 8px',
        background: 'rgba(245,250,237,0.9)',
        borderLeft: '1px solid rgba(207,225,185,0.4)',
        borderRight: '1px solid rgba(207,225,185,0.4)',
      }}>
        <div className="tab-scroll">
          {QUICK_QUESTIONS[lang].map((q, i) => (
            <button
              key={i}
              id={`quick-q-${i}`}
              onClick={() => sendMessage(q)}
              style={{
                padding: '7px 12px', borderRadius: 16,
                background: 'rgba(207,225,185,0.5)', border: '1px solid rgba(181,201,154,0.4)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#4a5c33',
                whiteSpace: 'nowrap', transition: 'all 0.2s',
                fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(181,201,154,0.7)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(207,225,185,0.5)'}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div style={{
        padding: '12px 16px 16px',
        background: 'white',
        borderRadius: '0 0 16px 16px',
        border: '1px solid rgba(207,225,185,0.5)',
        borderTop: 'none',
        display: 'flex', gap: 10, alignItems: 'flex-end',
      }}>
        <textarea
          ref={inputRef}
          id="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder={lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ...' : 'Ask your question...'}
          rows={1}
          style={{
            flex: 1, padding: '12px 16px',
            border: '2px solid var(--tea-green)',
            borderRadius: 14, fontSize: 14,
            background: 'rgba(245,250,237,0.8)',
            color: '#2d3a1e', outline: 'none',
            resize: 'none', transition: 'all 0.3s',
            fontFamily: "'Noto Sans Kannada', 'Inter', sans-serif",
            lineHeight: 1.5,
          }}
          onFocus={e => e.target.style.borderColor = '#718355'}
          onBlur={e => e.target.style.borderColor = 'var(--tea-green)'}
        />
        <button
          id="send-btn"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="btn-primary"
          style={{
            padding: '12px 16px', borderRadius: 14, minWidth: 'auto',
            opacity: !input.trim() || isTyping ? 0.5 : 1,
          }}
        >
          <Send size={18}/>
        </button>
      </div>
    </div>
  );
}
