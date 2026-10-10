const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'weather_dashboard_default_secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};