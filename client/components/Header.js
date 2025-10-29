import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import sessionManager from '../utils/sessionManager';
import SessionStatus from './SessionStatus';
import CartIcon from './CartIcon';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const location = useLocation();

  // FIXED: Theme toggle now uses data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Check if user is logged in using session manager
    try {
      const currentUser = sessionManager.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error getting current user:', error);
      setUser(null);
    }

    // Set up session monitoring
    const checkSession = () => {
      try {
        const isLoggedIn = sessionManager.isLoggedIn();
        if (!isLoggedIn) {
          // Session expired, clear user
          setUser(null);
        } else {
          // User logged in, update user
          const currentUser = sessionManager.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      }
    };

    // Check session every 5 minutes
    const sessionCheckInterval = setInterval(checkSession, 5 * 60 * 1000);

    // Check session on page focus
    const handleFocus = () => {
      checkSession();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(sessionCheckInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Use session manager to end session
    sessionManager.endSession();
    setUser(null);
    
    // Show logout confirmation
    alert('You have been logged out successfully!');
    
    // Redirect to homepage
    window.location.href = '/';
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="floating-header">
      <div className="header-container">
        {/* Logo Section */}
        <Link to="/" className="logo-section" aria-label="Go to homepage">
          <div className="logo-icon">🏁</div>
          <h1 className="logo-text">Merch for Fans</h1>
        </Link>

        {/* Navigation Menu */}
        <nav className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
          <div className="nav-link dropdown">
            <button className="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
              Sport Category
            </button>
            <div className="dropdown-menu">
              <Link to="/sports/cricket" className="dropdown-item">Cricket</Link>
              <Link to="/sports/football" className="dropdown-item">Football</Link>
              <Link to="/sports/basketball" className="dropdown-item">Basketball</Link>
              <Link to="/sports/motorsport" className="dropdown-item">Motorsport</Link>
            </div>
          </div>
          
          <Link to="/customize" className="nav-link">Custom Merch</Link>
          
          <div className="nav-link dropdown">
            <button className="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
              Special Collection
            </button>
            <div className="dropdown-menu">
              <Link to="/special/cricket" className="dropdown-item">Cricket</Link>
              <Link to="/special/football" className="dropdown-item">Football</Link>
              <Link to="/special/basketball" className="dropdown-item">Basketball</Link>
              <Link to="/special/motorsport" className="dropdown-item">Motorsport</Link>
            </div>
          </div>
          <Link to="/limited-edition" className="nav-link">Limited Editions</Link>
          <Link to="/hotsale" className="nav-link sale-link">Hot Sale</Link>
        </nav>

        {/* Action Icons */}
        <div className="action-icons">
          <Link to="/search" className="icon-btn search-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </Link>
          
          <Link to={user ? "/my-account" : "/login"} className={`icon-btn user-btn ${location.pathname === '/my-account' ? 'active' : ''}`} aria-label="My Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={location.pathname === '/my-account' ? 'red' : 'currentColor'} strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
          
          <CartIcon />

          {/* User Status */}
          {user ? (
            <div className="user-info">
              <SessionStatus />
            </div>
          ) : null}

          {/* Theme Toggle - MOVED INSIDE action-icons */}
          <button
            className="icon-btn theme-toggle"
            aria-label="Toggle theme"
            title="Toggle light/dark"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              // Sun icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
              </svg>
            ) : (
              // Moon icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          <span className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}></span>
        </button>
      </div>
    </header>
  );
}

export default Header;