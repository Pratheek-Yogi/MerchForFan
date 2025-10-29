// Updated HomePage.js
import React, { useEffect, useState } from 'react';
import './HomePage.css';
import Slideshow from './Slideshow';
import SportsGrid from './SportsGrid';
import LimitedEditions from './LimitedEditions';
import TrendingProducts from './TrendingProducts';
import PopularAthletes from './PopularAthletes';

function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-page">
      {/* Scroll Progress Bar */}
      <div 
        className="scroll-progress" 
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Floating Particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      <div className="home-page-container">
        {/* Enhanced Header Section */}
        <div className="home-page-header">
          <h1 className="home-page-title glow">
            Welcome to Merch for Fans
          </h1>
          <p className="home-page-subtitle">
            Your ultimate destination for sport merchandise and fan gear.
          </p>
        </div>
        
        {/* Component Wrappers for Enhanced Styling */}
        <div className="component-wrapper">
          <Slideshow />
        </div>
        
        <div className="component-wrapper">
          <SportsGrid />
        </div>
        
        <div className="component-wrapper">
          <LimitedEditions />
        </div>
        
        <div className="component-wrapper">
          <TrendingProducts />
        </div>
        
        <div className="component-wrapper">
          <PopularAthletes />
        </div>
      </div>
    </div>
  );
}

export default HomePage;