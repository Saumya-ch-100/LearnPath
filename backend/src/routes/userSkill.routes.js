import express from 'express';
import { 
  getUserSkills, 
  upsertUserSkill, 
  updateUserSkill,
  deleteUserSkill
} from '../controllers/userSkill.controller.js';

const router = express.Router();

router.get('/', getUserSkills);
router.post('/', upsertUserSkill);
router.patch('/:id', updateUserSkill);
router.delete('/:id', deleteUserSkill);

export default router;
