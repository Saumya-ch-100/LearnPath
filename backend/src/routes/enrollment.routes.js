import express from 'express';
import { 
  createEnrollment, 
  getUserEnrollments, 
  updateEnrollment 
} from '../controllers/enrollment.controller.js';

const router = express.Router();

router.post('/', createEnrollment);
router.get('/', getUserEnrollments);
router.patch('/:id', updateEnrollment);

export default router;
