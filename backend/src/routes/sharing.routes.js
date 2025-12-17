import express from 'express';
import { 
  shareWithMentor, 
  getMentorLearners,
  revokeAccess
} from '../controllers/sharing.controller.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Learner shares with mentor
router.post('/share-with-mentor', shareWithMentor);
router.delete('/revoke/:mentorId', revokeAccess);

// Mentor views shared learners
router.get('/mentor/learners', requireRole('mentor', 'admin'), getMentorLearners);

export default router;
