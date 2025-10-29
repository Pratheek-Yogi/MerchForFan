import React, { useEffect, useRef, useState } from 'react';
import config from '../config/googleAuth';

function GoogleSignIn({ onSuccess, onError, disabled = false }) {
  const googleButtonRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  const [googleAvailable, setGoogleAvailable] = useState(true);

  useEffect(() => {
    console.log('=== GOOGLE OAUTH DEBUG ===');
    console.log('Client ID:', config.googleClientId);
    console.log('Current URL:', window.location.href);
    
    
    // Validate client ID
    if (!config.googleClientId || 
        config.googleClientId === "YOUR_GOOGLE_CLIENT_ID_HERE" ||
        !config.googleClientId.includes('.apps.googleusercontent.com')) {
      console.error('Invalid Google Client ID configuration');
      if (onError) onError('Google authentication not configured properly');
      setGoogleAvailable(false);
      return;
    }

    // Only load the script once
    if (scriptLoadedRef.current) return;
    
    // Load the Google Identity Services library
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    // Set a timeout for script loading
    const loadTimeout = setTimeout(() => {
      if (!scriptLoadedRef.current) {
        console.warn('Google script loading timeout - service may be down');
        setGoogleAvailable(false);
        if (onError) onError('Google authentication service temporarily unavailable');
      }
    }, 10000); // 10 second timeout

    script.onload = () => {
      clearTimeout(loadTimeout);
      scriptLoadedRef.current = true;
      
      if (!window.google) {
        console.error('Google library not loaded properly');
        setGoogleAvailable(false);
        if (onError) onError('Google authentication service unavailable');
        return;
      }

      try {
        // Initialize the Google Identity Services client
        window.google.accounts.id.initialize({
          client_id: config.googleClientId,
          callback: handleGoogleLoginSuccess,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the Google Login Button
        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            { 
              theme: 'outline', 
              size: 'large',
              width: 500,
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left'
            }
          );
          
          console.log('Google Sign-In button rendered successfully');
        }
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        setGoogleAvailable(false);
        if (onError) onError('Google authentication service error');
      }
    };

    script.onerror = () => {
      clearTimeout(loadTimeout);
      console.error('Failed to load Google Identity Services script');
      setGoogleAvailable(false);
      if (onError) onError('Google authentication service unavailable');
    };

    document.head.appendChild(script);

    return () => {
      clearTimeout(loadTimeout);
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onError]);

  const handleGoogleLoginSuccess = async (response) => {
    if (!response || !response.credential) {
      console.error('Invalid Google response:', response);
      if (onError) onError('Invalid authentication response');
      return;
    }

    const idToken = response.credential;
    console.log("Google ID Token received");

    try {
      // Send the ID token to your backend for verification
      const backendResponse = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await backendResponse.json();
      
      if (backendResponse.ok) {
        console.log('Backend verification successful');
        if (onSuccess) onSuccess(data);
      } else {
        console.error('Backend verification failed:', data);
        if (onError) onError(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Backend verification error:', error);
      if (onError) onError('Network error during authentication');
    }
  };

  const handleManualGoogleAuth = () => {
    // Fallback: Redirect to Google OAuth manually
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.googleClientId}&redirect_uri=${window.location.origin}/auth/google/callback&response_type=code&scope=email profile&access_type=offline&prompt=consent`;
    window.location.href = googleAuthUrl;
  };

  // If Google service is unavailable, show fallback
  if (!googleAvailable) {
    return (
      <div className="google-fallback">
        <div className="service-warning">
          <p>⚠️ Google authentication temporarily unavailable</p>
          <button 
            className="google-button"
            onClick={handleManualGoogleAuth}
            disabled={disabled}
          >
            <div className="google-icon">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            Continue with Google (Alternative)
          </button>
          <p className="fallback-note">Using alternative authentication method</p>
        </div>
      </div>
    );
  }

  // Normal Google button
  return (
    <div className="google-sign-in-container">
      <div 
        ref={googleButtonRef} 
        style={{ 
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? 'none' : 'auto'
        }}
      />
    </div>
  );
}

export default GoogleSignIn;