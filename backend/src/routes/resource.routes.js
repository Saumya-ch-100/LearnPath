import express from 'express';
import { 
  getAllResources, 
  getResourceById, 
  createResource, 
  updateResource, 
  deleteResource 
} from '../controllers/resource.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public/protected routes
router.get('/', getAllResources);
router.get('/:id', getResourceById);

// Admin-only routes
router.post('/', authMiddleware, requireRole('admin'), createResource);
router.patch('/:id', authMiddleware, requireRole('admin'), updateResource);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteResource);

export default router;
