import React from 'react';
import { Link } from 'react-router-dom';
import './LimitedEditions.css';
import Img1 from './images/Football_Merch/ColdPalmer1.webp';
import Img2 from './images/Popular_Athletes/lewis_hamilton/lewis_hamilton7.jpg';

function LimitedEditions() {
  const items = [
    {
      title: 'Cold Palmer',
      subtitle: 'Up to 20% off',
      img: Img1,
      numericId: 8, // Use the actual numericId for Cold Palmer product
      category: 'Football'
    },
    {
      title: 'Lewis Hamilton LH44 Collection',
      subtitle: 'LH44 Merch',
      img: Img2,
      numericId: 307, // Use the actual numericId for Lewis Hamilton product
      category: 'Popular Athletes'
    },
  ];

  return (
    <section className="limited-editions">
      <h2>Limited Editions</h2>
      <div className="le-grid">
        {items.map((item, idx) => (
          <Link 
            to={`/product/${item.numericId}?category=${encodeURIComponent(item.category)}`} 
            key={idx} 
            className="le-card-link"
          >
            <article className="le-card">
              <img src={item.img} alt={item.title} className="le-bg" />
              <div className="le-overlay" />
              <div className="le-content">
                <h2 className="le-title always-white">{item.title}</h2>
                <p className="le-sub always-white">{item.subtitle}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default LimitedEditions;