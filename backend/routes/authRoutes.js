import express from 'express';
import {
  studentSignup,
  studentLogin,
  driverLogin,
  verifyToken,
  updateProfile,
  getPastRides,
  getPastHorns,
  getDashboard
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

// Profile update (protected)
router.put('/profile/update', authMiddleware, updateProfile);

// Past rides - driver (protected)
router.get('/driver/past-rides', authMiddleware, getPastRides);

// Past horns - student (protected)
router.get('/student/past-horns', authMiddleware, getPastHorns);

// Dashboard (protected)
router.get('/dashboard', authMiddleware, getDashboard);

export default router;
