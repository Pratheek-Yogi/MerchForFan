const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // TEMPORARY: Accept any token for testing
  console.log('Token received:', token);
  
  if (token.startsWith('google_jwt_') || token.startsWith('demo_token_')) {
    // Accept Google/demo tokens temporarily
    req.user = { id: 'demo_user_id' };
    return next();
  }

  // Original JWT verification for other tokens
  try {
    const JWT_SECRET = 'your_jwt_secret_key_here';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};