import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Driver from '../models/Driver.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user based on type
    let user;
    if (decoded.type === 'student') {
      user = await Student.findById(decoded.id);
    } else if (decoded.type === 'driver') {
      user = await Driver.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.userType = decoded.type;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
