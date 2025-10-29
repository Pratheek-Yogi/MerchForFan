import React, { useEffect } from 'react';
import sessionManager from '../utils/sessionManager';

function SessionInitializer({ onSessionChange }) {
  useEffect(() => {
    // Initialize session on app load
    const initializeSession = () => {
      const isLoggedIn = sessionManager.isLoggedIn();
      const user = sessionManager.getCurrentUser();
      
      // Notify parent component about session status
      if (onSessionChange) {
        onSessionChange({ isLoggedIn, user });
      }
      
      // Start auto-refresh if logged in
      if (isLoggedIn) {
        sessionManager.startAutoRefresh();
      }
    };

    // Initialize immediately
    initializeSession();

    // Set up session monitoring
    const checkSession = () => {
      const isLoggedIn = sessionManager.isLoggedIn();
      const user = sessionManager.getCurrentUser();
      
      if (onSessionChange) {
        onSessionChange({ isLoggedIn, user });
      }
    };

    // Check session every 5 minutes
    const sessionCheckInterval = setInterval(checkSession, 5 * 60 * 1000);

    // Check session on page focus
    const handleFocus = () => {
      checkSession();
    };
    window.addEventListener('focus', handleFocus);

    // Check session on page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(sessionCheckInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      sessionManager.stopAutoRefresh();
    };
  }, [onSessionChange]);

  return null; // This component doesn't render anything
}

export default SessionInitializer;
