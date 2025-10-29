import React from 'react';
import { useParams } from 'react-router-dom';

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const sportMeta = {
  cricket: {
    title: 'Cricket',
    description: 'Explore the latest cricket merch, jerseys, and fan gear.'
  },
  football: {
    title: 'Football',
    description: 'Shop football kits, balls, boots, and exclusive fanwear.'
  },
  basketball: {
    title: 'Basketball',
    description: 'Find hoops essentials, jerseys, and street-style apparel.'
  },
  motorsport: {
    title: 'Motorsport',
    description: 'Discover racing team merchandise and limited editions.'
  }
};

function SportsCategoryPage() {
  const { sport } = useParams();
  const key = String(sport || '').toLowerCase();
  const meta = sportMeta[key] || {
    title: capitalize(key || 'Sport'),
    description: 'Browse top merchandise and collections.'
  };

  return (
    <div style={{ padding: '24px', color: 'var(--text)' }}>
      <h1 style={{ marginBottom: 8 }}>{meta.title}</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>{meta.description}</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16
      }}>
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: 16
          }}>
            <div style={{
              height: 140,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 8,
              marginBottom: 12
            }} />
            <div style={{ fontWeight: 600 }}>Featured {meta.title} Item {i}</div>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>Coming soon</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SportsCategoryPage;


