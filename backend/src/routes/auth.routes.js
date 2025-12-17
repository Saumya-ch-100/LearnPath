import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  updatePreferences,
  changePassword, 
  deleteAccount 
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.patch('/profile', authMiddleware, updateProfile);
router.patch('/preferences', authMiddleware, updatePreferences);
router.patch('/change-password', authMiddleware, changePassword);
router.delete('/account', authMiddleware, deleteAccount);

export default router;
