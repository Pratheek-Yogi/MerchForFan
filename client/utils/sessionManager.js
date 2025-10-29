// Session Management Utility
class SessionManager {
  constructor() {
    this.SESSION_KEY = 'merchfan_session';
    this.USER_KEY = 'merchfan_user';
    this.TOKEN_KEY = 'token'; // Corrected token key
    this.SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // Create a new session
  createSession(user, token) {
    const sessionData = {
      user: user,
      token: token,
      loginTime: Date.now(),
      expiryTime: Date.now() + this.SESSION_DURATION,
      isActive: true
    };

    // Store session data
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);

    console.log('Session created:', sessionData);
    return sessionData;
  }

  // Get current session
  getSession() {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() > session.expiryTime) {
        this.endSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      this.endSession();
      return null;
    }
  }

  // Get current user
  getCurrentUser() {
    const session = this.getSession();
    return session ? session.user : null;
  }

  // Get current token
  getCurrentToken() {
    const session = this.getSession();
    return session ? session.token : null;
  }

  // Check if user is logged in
  isLoggedIn() {
    const session = this.getSession();
    return session && session.isActive;
  }

  // Update session (extend expiry)
  updateSession() {
    const session = this.getSession();
    if (session) {
      session.expiryTime = Date.now() + this.SESSION_DURATION;
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }

  // End session (logout)
  endSession() {
    // Clear all session data
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    
    // Clear any other auth-related data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    console.log('Session ended');
    return true;
  }

  // Refresh session (extend expiry time)
  refreshSession() {
    const session = this.getSession();
    if (session) {
      session.expiryTime = Date.now() + this.SESSION_DURATION;
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      console.log('Session refreshed');
      return true;
    }
    return false;
  }

  // Get session info
  getSessionInfo() {
    const session = this.getSession();
    if (!session) return null;

    const timeRemaining = session.expiryTime - Date.now();
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    return {
      user: session.user,
      loginTime: new Date(session.loginTime),
      expiryTime: new Date(session.expiryTime),
      hoursRemaining,
      minutesRemaining,
      isActive: session.isActive
    };
  }

  // Auto-refresh session on user activity
  startAutoRefresh() {
    // Refresh session every 30 minutes
    this.refreshInterval = setInterval(() => {
      if (this.isLoggedIn()) {
        this.refreshSession();
      } else {
        this.stopAutoRefresh();
      }
    }, 30 * 60 * 1000); // 30 minutes
  }

  // Stop auto-refresh
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  // Handle page visibility change (refresh session when user returns)
  handleVisibilityChange() {
    if (document.visibilityState === 'visible' && this.isLoggedIn()) {
      this.refreshSession();
    }
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

// Set up event listeners
document.addEventListener('visibilitychange', () => {
  sessionManager.handleVisibilityChange();
});

// Start auto-refresh when page loads
if (sessionManager.isLoggedIn()) {
  sessionManager.startAutoRefresh();
}

export default sessionManager;
