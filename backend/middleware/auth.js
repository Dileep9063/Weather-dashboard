const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided, authorization denied' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database (excluding password)
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found, authorization denied' 
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token, authorization denied' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired, please login again' 
      });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error in authentication' 
    });
  }
};

module.exports = auth;