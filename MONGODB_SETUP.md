# MongoDB Setup Guide for Merch Fan

## 🔧 **Step 1: Update MongoDB Connection String**

You need to replace `<db_password>` with your actual MongoDB password in the connection string.

### **Update `server/config/database.js`:**

```javascript
// Replace this line:
const MONGODB_URI = 'mongodb+srv://MerchFan:<db_password>@userlogin.rzhrkvu.mongodb.net/?retryWrites=true&w=majority&appName=userlogin';

// With your actual password:
const MONGODB_URI = 'mongodb+srv://MerchFan:YOUR_ACTUAL_PASSWORD@userlogin.rzhrkvu.mongodb.net/?retryWrites=true&w=majority&appName=userlogin';
```

## 🚀 **Step 2: Test the Connection**

1. **Start your server:**
   ```bash
   npm run dev
   ```

2. **Check the console** for connection messages:
   - ✅ `Connected to MongoDB Atlas`
   - ✅ `Connected to database: merchfan_db`

3. **Test signup** by creating a new account
4. **Test login** with the created account

## 📊 **Step 3: Database Structure**

Your MongoDB will have the following collections:

### **Users Collection (`users`):**
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String (hashed with bcrypt),
  provider: String ('local' or 'google'),
  googleId: String (for Google users),
  picture: String (profile picture URL),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 **Step 4: Password Security**

- ✅ **Passwords are hashed** using bcrypt with 12 salt rounds
- ✅ **Passwords are never stored** in plain text
- ✅ **Password verification** uses bcrypt.compare()
- ✅ **User data is sanitized** before storage

## 🎯 **Step 5: Authentication Flow**

### **Local Signup:**
1. User fills signup form
2. Password is hashed with bcrypt
3. User data stored in MongoDB
4. Session created with user data

### **Local Login:**
1. User enters email/password
2. System finds user by email
3. Password verified with bcrypt
4. Session created if valid

### **Google OAuth:**
1. Google token verified
2. User created/found in MongoDB
3. Google account linked to user
4. Session created with user data

## 🛠️ **Step 6: Troubleshooting**

### **Connection Issues:**
- Check your MongoDB password is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify the connection string format

### **Authentication Issues:**
- Check bcrypt is installed: `npm list bcrypt`
- Verify MongoDB connection is working
- Check server console for error messages

### **Database Issues:**
- Check MongoDB Atlas dashboard
- Verify database and collection names
- Check user permissions

## 📝 **Step 7: Environment Variables (Optional)**

For production, you can use environment variables:

```javascript
// In server/config/database.js
const MONGODB_URI = process.env.MONGODB_URI || 'your-connection-string';
```

## ✅ **Step 8: Verification**

Test these endpoints:

1. **POST `/api/auth/signup`** - Create new user
2. **POST `/api/auth/login`** - Login with credentials
3. **POST `/api/auth/google`** - Google OAuth login
4. **GET `/api/users`** - Get all users (admin)

## 🎉 **You're Ready!**

Your MongoDB integration is complete with:
- ✅ Secure password hashing
- ✅ User registration and login
- ✅ Google OAuth support
- ✅ Session management
- ✅ Database persistence

**Replace `<db_password>` with your actual password and test the authentication!** 🚀
