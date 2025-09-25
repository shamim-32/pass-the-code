const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({message:'no token'});
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash');
    if(!user) return res.status(401).json({message:'user not found'});
    req.user = user;
    next();
  } catch(e) {
    return res.status(401).json({message:'invalid token'});
  }
};
