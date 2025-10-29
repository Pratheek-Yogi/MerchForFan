# 🎯 Google OAuth Redirect URIs - Quick Reference

## ✅ Correct Authorized Redirect URIs for Merch Fan

When setting up your Google OAuth Client ID, add **ALL** of these URLs to your "Authorized redirect URIs":

### Development URLs:
```
http://localhost:3000/
http://localhost:3000/login
http://localhost:3000/signup
http://localhost:5000/
```

### Production URLs (replace with your domain):
```
https://yourdomain.com/
https://yourdomain.com/login
https://yourdomain.com/signup
```

## 🔍 Why Each URI is Needed

- **`http://localhost:3000/`** - Homepage redirect after login
- **`http://localhost:3000/login`** - Login page redirect
- **`http://localhost:3000/signup`** - Signup page redirect
- **`http://localhost:5000/`** - Backend server redirect (if different port)

## ⚠️ Common Mistakes to Avoid

❌ **Don't do this:**
- `http://localhost:3000` (missing trailing slash)
- `https://localhost:3000` (wrong protocol for localhost)
- Missing specific routes like `/login` and `/signup`

✅ **Do this:**
- Include trailing slashes: `http://localhost:3000/`
- Include specific routes: `http://localhost:3000/login`
- Use HTTP for localhost, HTTPS for production

## 🚀 Quick Fix Steps

1. **Go to Google Cloud Console**
2. **APIs & Services → Credentials**
3. **Edit your OAuth 2.0 Client ID**
4. **Add the URLs above to "Authorized redirect URIs"**
5. **Save**
6. **Clear browser cache**
7. **Try login again**

## 🎯 The 404 Error Fix

The "404. That's an error" from Google happens because:
- Google tries to redirect to a URL that's not in your authorized list
- The URL must match **exactly** (including trailing slashes)
- Missing routes like `/login` and `/signup` cause this error

**This fix will resolve the 404 error!** 🎉
