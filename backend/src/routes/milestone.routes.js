import express from 'express';
import { 
  createMilestone, 
  getUserMilestones, 
  updateMilestone 
} from '../controllers/milestone.controller.js';

const router = express.Router();

router.post('/', createMilestone);
router.get('/', getUserMilestones);
router.patch('/:id', updateMilestone);

export default router;
