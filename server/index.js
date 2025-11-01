require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config/jwt');
const config = require('./config/googleAuth');
const database = require('./config/database');
const User = require('./models/User');
const PasswordReset = require('./models/PasswordReset');
const ordersRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Google OAuth configuration
const client = new OAuth2Client(config.googleClientId);

// Middleware
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '').split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/orders', ordersRoutes);
app.use('/api/products', require('./routes/products'));
app.use('/api/user', require('./routes/profile'));
app.use('/api/user/address', require('./routes/address'));

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express.js server!' });
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Authentication endpoints
app.post('/api/auth/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password,
            provider: 'local'
        });

        // Save user to MongoDB
        const userId = await user.save();

        console.log('User created successfully:', { userId, email });

        // Sign a JWT
        const signupPayload = { user: { id: userId } };
        const token = jwt.sign(signupPayload, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'Account created successfully!',
            user: {
                id: userId,
                firstName,
                lastName,
                email,
                provider: 'local'
            },
            token
        });
    } catch (error) {
        console.error('Signup error:', error);

        if (error.message === 'User with this email already exists') {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Authenticate user against MongoDB
        const authResult = await User.authenticate(email, password);

        if (!authResult.success) {
            return res.status(401).json({ message: authResult.message });
        }

        console.log('User authenticated successfully:', { email });

        // Sign a JWT
        const loginPayload = { user: { id: authResult.user._id } };
        const token = jwt.sign(loginPayload, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful!',
            user: authResult.user,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Google OAuth endpoint
app.post('/api/auth/google', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: 'ID token is missing.' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: config.googleClientId,
        });

        const payload = ticket.getPayload();
        const googleUserData = {
            id: payload['sub'],
            email: payload['email'],
            firstName: payload['given_name'],
            lastName: payload['family_name'],
            name: payload['name'],
            picture: payload['picture']
        };

        // Create or find user in MongoDB
        const result = await User.createOrFindGoogleUser(googleUserData);

        if (!result.success) {
            return res.status(500).json({
                message: 'Failed to process Google authentication',
                error: result.message
            });
        }

        console.log("Google authentication successful:", result.user);

        // Sign a JWT
        const googlePayload = { user: { id: result.user._id } };
        const token = jwt.sign(googlePayload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Google authentication successful',
            user: result.user,
            token
        });

    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed.' });
    }
});

// Forgot Password endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address' });
        }

        // Generate reset code
        const result = await PasswordReset.generateResetCode(email);

        // In a real application, you would send the code via email.
        // For example, using a service like Nodemailer or SendGrid.
        // sendPasswordResetEmail(email, result.code);

        res.json({
            message: 'Password reset code sent to your email'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Reset Password endpoint
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'Email, code, and new password are required' });
        }

        // Verify reset code
        const verification = await PasswordReset.verifyResetCode(email, code);
        if (!verification.success) {
            return res.status(400).json({ message: verification.message });
        }

        // Update user password
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password in database
        const db = database.getDb();
        const userLoginCollection = db.collection('UserLogin');

        await userLoginCollection.updateOne(
            { email },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        );

        // Mark reset code as used
        await PasswordReset.markCodeAsUsed(email, code);

        console.log(`✅ Password reset successful for ${email}`);

        res.json({
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Serve React app for all other routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await database.connect();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database. Server not started.', error);
    process.exit(1);
  }
};

startServer();
