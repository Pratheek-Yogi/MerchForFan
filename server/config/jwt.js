// server/config/jwt.js

// It's crucial to use a strong, unique secret for JWT signing.
// This should be stored in an environment variable for production.
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined in production environment.');
} else if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Using a default for development. Please set a secure JWT_SECRET environment variable for production.');
}

module.exports = {
  JWT_SECRET
};
