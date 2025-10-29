import React, { useState, useEffect } from 'react';
import sessionManager from '../utils/sessionManager';
import './SessionStatus.css';

function SessionStatus() {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateSessionInfo = () => {
      try {
        const info = sessionManager.getSessionInfo();
        setSessionInfo(info);
      } catch (error) {
        console.error('Error getting session info:', error);
        setSessionInfo(null);
      }
    };

    // Update session info on mount
    updateSessionInfo();

    // Update every minute
    const interval = setInterval(updateSessionInfo, 60000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array

  if (!sessionInfo) return null;

  const handleLogout = () => {
    sessionManager.endSession();
    window.location.reload();
  };

  const handleRefreshSession = () => {
    sessionManager.refreshSession();
    const info = sessionManager.getSessionInfo();
    setSessionInfo(info);
  };

  return (
    <div className="session-status">
      <button 
        className="session-toggle-btn"
        onClick={() => setIsVisible(!isVisible)}
        title="Session Information"
      >
        👤 {sessionInfo.user.firstName || sessionInfo.user.name}
      </button>
      
      {isVisible && (
        <div className="session-panel">
          <div className="session-header">
            <h4>Session Information</h4>
            <button 
              className="close-btn"
              onClick={() => setIsVisible(false)}
            >
              ×
            </button>
          </div>
          
          <div className="session-details">
            <div className="session-item">
              <strong>User:</strong> {sessionInfo.user.name}
            </div>
            <div className="session-item">
              <strong>Email:</strong> {sessionInfo.user.email}
            </div>
            <div className="session-item">
              <strong>Provider:</strong> {sessionInfo.user.provider}
            </div>
            <div className="session-item">
              <strong>Login Time:</strong> {sessionInfo.loginTime.toLocaleString()}
            </div>
            <div className="session-item">
              <strong>Expires:</strong> {sessionInfo.expiryTime.toLocaleString()}
            </div>
            <div className="session-item">
              <strong>Time Remaining:</strong> {sessionInfo.hoursRemaining}h {sessionInfo.minutesRemaining}m
            </div>
          </div>
          
          <div className="session-actions">
            <button 
              className="refresh-btn"
              onClick={handleRefreshSession}
            >
              Refresh Session
            </button>
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionStatus;
