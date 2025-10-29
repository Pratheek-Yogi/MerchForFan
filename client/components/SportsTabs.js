import React, { useState } from 'react';
import './SportsTabs.css';

function SportsTabs() {
  const [activeTab, setActiveTab] = useState('Cricket');

  const tabs = ['Cricket', 'Basketball', 'Motorsport', 'Football'];

  const cardDataByTab = {
    Cricket: [
      { title: 'Cricket', subtitle: 'Bats, jerseys, caps and more', color: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)', emoji: '🏏' },
    ],
    Basketball: [
      { title: 'Basketball', subtitle: 'Official balls, apparel, fan gear', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', emoji: '🏀' },
    ],
    Motorsport: [
      { title: 'Motorsport', subtitle: 'Team wear, caps, collectibles', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', emoji: '🏎️' },
    ],
    Football: [
      { title: 'Football', subtitle: 'Club kits, boots, accessories', color: 'linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)', emoji: '⚽' },
    ],
  };

  const cards = cardDataByTab[activeTab] || [];

  return (
    <div>
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-btn${activeTab === tab ? ' active' : ''} always-white`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="cards">
        {cards.map((card, idx) => (
          <div key={idx} className="card" style={{ background: card.color }}>
            <span className="emoji" style={{ fontSize: '2rem' }}>{card.emoji}</span>
            <h3 className="always-white">{card.title}</h3>
            <p className="always-white">{card.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SportsTabs;
