import express from 'express';
import { 
  getAllSkills, 
  createSkill, 
  updateSkill, 
  deleteSkill 
} from '../controllers/skill.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/', getAllSkills);

// Admin-only routes
router.post('/', authMiddleware, requireRole('admin'), createSkill);
router.patch('/:id', authMiddleware, requireRole('admin'), updateSkill);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteSkill);

export default router;
