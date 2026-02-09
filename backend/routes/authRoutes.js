import express from 'express';
import {
  studentSignup,
  studentLogin,
  driverLogin,
  verifyToken
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Student routes
router.post('/student/signup', studentSignup);
router.post('/student/login', studentLogin);

// Driver routes
router.post('/driver/login', driverLogin);

// Verify token (protected route)
router.get('/verify', authMiddleware, verifyToken);

export default router;
