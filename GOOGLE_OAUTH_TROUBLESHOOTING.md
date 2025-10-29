# Google OAuth 400 Error Troubleshooting Guide

## The Error
```
400. That's an error.
The server cannot process the request because it is malformed. It should not be retried.
```

## Most Common Causes

### 1. **Client ID Not Configured** ⚠️
**Problem**: You're still using the placeholder `"YOUR_GOOGLE_CLIENT_ID_HERE"`
**Solution**: Replace with your actual Google Client ID

### 2. **Invalid Client ID Format**
**Problem**: Client ID doesn't match Google's format
**Correct Format**: `123456789-abcdefghijklmnop.apps.googleusercontent.com`

### 3. **OAuth Consent Screen Not Configured**
**Problem**: Google OAuth consent screen is not set up
**Solution**: Configure OAuth consent screen in Google Cloud Console

### 4. **Authorized Origins Missing**
**Problem**: Your domain is not in the authorized origins list
**Solution**: Add `http://localhost:3000` and `http://localhost:5000`

## Step-by-Step Fix

### Step 1: Get Your Google Client ID
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Select your project (or create one)
3. Go to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Copy the Client ID (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

### Step 2: Update Configuration Files

**Update `client/config/googleAuth.js`:**
```javascript
const config = {
  googleClientId: "123456789-abcdefghijklmnop.apps.googleusercontent.com" // Your actual Client ID
};
```

**Update `server/config/googleAuth.js`:**
```javascript
const config = {
  googleClientId: "123456789-abcdefghijklmnop.apps.googleusercontent.com" // Your actual Client ID
};
```

### Step 3: Configure OAuth Consent Screen
1. In Google Cloud Console, go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "Merch Fan"
   - User support email: your email
   - Developer contact: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email) if in testing mode

### Step 4: Configure Authorized Origins
1. Go to "APIs & Services" → "Credentials"
2. Click on your OAuth 2.0 Client ID
3. Add to "Authorized JavaScript origins":
   - `http://localhost:3000`
   - `http://localhost:5000`
   - `http://127.0.0.1:3000`
   - `http://127.0.0.1:5000`

### Step 5: Enable Required APIs
1. Go to "APIs & Services" → "Library"
2. Search for and enable:
   - Google+ API (or Google Identity API)
   - Google OAuth2 API

## Quick Test Without Google OAuth

If you want to test the app without Google OAuth first, I can create a temporary bypass. Let me know if you need this!

## Still Having Issues?

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: See what requests are being made
3. **Verify Client ID**: Make sure it's copied correctly (no extra spaces)
4. **Test in Incognito**: Clear browser cache/cookies
5. **Check Google Cloud Console**: Verify all settings are saved

## Common Mistakes
- ❌ Using Client Secret instead of Client ID
- ❌ Missing quotes around Client ID
- ❌ Extra spaces in Client ID
- ❌ Not saving changes in Google Cloud Console
- ❌ Using wrong project in Google Cloud Console
