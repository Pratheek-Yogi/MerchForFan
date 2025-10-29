# Real Google OAuth Setup Guide

## 🚀 Get Your Real Google Client ID

To use **real Google OAuth** that shows actual Gmail accounts, follow these steps:

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create New Project**:
   - Click the project dropdown at the top
   - Click "New Project"
   - Name: "Merch Fan" (or your preferred name)
   - Click "Create"

### Step 2: Enable Google APIs

1. **Go to APIs & Services → Library**
2. **Enable these APIs**:
   - Google+ API
   - Google Identity API
   - People API (for user profile access)

### Step 3: Configure OAuth Consent Screen

1. **Go to APIs & Services → OAuth consent screen**
2. **Choose User Type**: External (for public access)
3. **Fill Required Fields**:
   - App name: "Merch Fan"
   - User support email: Your email
   - Developer contact: Your email
4. **Add Authorized Domains**:
   - `localhost` (for development)
   - Your production domain (when deployed)
5. **Click "Save and Continue"**

### Step 4: Create OAuth 2.0 Credentials

1. **Go to APIs & Services → Credentials**
2. **Click "Create Credentials" → "OAuth client ID"**
3. **Choose Application Type**: Web application
4. **Configure**:
   - Name: "Merch Fan Web Client"
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `http://localhost:5000`
     - Your production domain
   - **Authorized redirect URIs**:
     - `http://localhost:3000/`
     - `http://localhost:5000/`
     - `http://localhost:3000/login`
     - `http://localhost:3000/signup`
     - Your production domain + `/`
     - Your production domain + `/login`
     - Your production domain + `/signup`
5. **Click "Create"**

### Step 5: Copy Your Client ID

After creating credentials, you'll get a **Client ID** that looks like:
```
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

### Step 6: Update Your Configuration

Replace the placeholder Client ID in both files:

**client/config/googleAuth.js**:
```javascript
const config = {
  googleClientId: "YOUR_ACTUAL_CLIENT_ID_HERE"
};
```

**server/config/googleAuth.js**:
```javascript
const config = {
  googleClientId: "YOUR_ACTUAL_CLIENT_ID_HERE"
};
```

### Step 7: Test Real Google Login

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Visit your login page**: http://localhost:3000/login

3. **Click "Continue with Google"** - you should see:
   - Real Google account picker
   - All your Gmail accounts
   - Google's official login interface

## 🎯 What You'll See

With real Google OAuth, users will see:
- ✅ **Google Account Picker** with all Gmail accounts
- ✅ **Official Google Login Interface**
- ✅ **Real user data** (name, email, profile picture)
- ✅ **Secure authentication** through Google's servers

## 🔧 Troubleshooting

### ❌ "404. That's an error" from Google
**This is the most common issue!** It means your **Authorized Redirect URIs** are misconfigured.

**Fix:**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Edit your OAuth 2.0 Client ID
3. **Add these exact URLs to "Authorized redirect URIs":**
   - `http://localhost:3000/` (with trailing slash)
   - `http://localhost:3000/login`
   - `http://localhost:3000/signup`
   - `http://localhost:5000/` (if using different port)
4. **Save and try again**

**Why this happens:**
- Google is very strict about exact URL matches
- `http://localhost:3000` ≠ `http://localhost:3000/` (trailing slash matters)
- Missing specific routes like `/login` and `/signup`

### If you see "This app isn't verified":
1. Go to OAuth consent screen
2. Add your email to "Test users" section
3. Or publish the app (requires verification for production)

### If you get 400 errors:
1. Check that your Client ID is correct
2. Verify authorized origins include `http://localhost:3000`
3. Make sure the OAuth consent screen is configured

### If the Google button doesn't appear:
1. Check browser console for errors
2. Verify the Google script is loading
3. Check that your Client ID is properly formatted

## 🚀 Production Deployment

When deploying to production:
1. Add your production domain to authorized origins
2. Update OAuth consent screen with production domain
3. Consider app verification for public use

---

**Your app will now show real Google accounts for login!** 🎉
