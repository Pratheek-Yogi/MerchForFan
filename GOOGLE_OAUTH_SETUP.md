# Google OAuth Setup Guide

## How to Set Up Google OAuth for Merch Fan

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)

### Step 2: Create OAuth 2.0 Credentials
1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add authorized origins:
   - `http://localhost:3000` (for development)
   - `http://localhost:5000` (for development)
   - Your production domain (when deployed)

### Step 3: Configure Google Client ID
Update the configuration files with your Google Client ID:

**Frontend Configuration** (`client/config/googleAuth.js`):
```javascript
const config = {
  googleClientId: "your_client_id_here"
};
```

**Backend Configuration** (`server/config/googleAuth.js`):
```javascript
const config = {
  googleClientId: "your_client_id_here"
};
```

### Step 4: Test the Integration
1. Start your development server: `npm run dev`
2. Navigate to `/login` or `/signup`
3. Click the Google sign-in button
4. Complete the Google OAuth flow
5. Check the console for successful authentication

## Security Notes
- Never commit your `.env` file to version control
- Use different Client IDs for development and production
- Regularly rotate your OAuth credentials
- Monitor usage in Google Cloud Console

## Troubleshooting
- **"Invalid client"**: Check that your Client ID is correct
- **"Origin mismatch"**: Add your domain to authorized origins
- **"Script failed to load"**: Check your internet connection and Google's CDN
- **"Token verification failed"**: Ensure Client ID matches between frontend and backend
