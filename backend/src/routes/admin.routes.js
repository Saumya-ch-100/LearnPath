import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getSystemAnalytics 
} from '../controllers/admin.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminOnly } from '../middleware/authorize.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminOnly);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Analytics
router.get('/analytics', getSystemAnalytics);

export default router;
