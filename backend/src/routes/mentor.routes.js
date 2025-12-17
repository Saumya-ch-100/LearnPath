import express from 'express';
import {
  getAllMentors,
  assignMentor,
  removeMentor,
  getMyLearners,
  getLearnerProgress,
  leaveFeedback,
  getMyFeedback,
  askQuestion,
  getMyQuestions,
  getLearnerQuestions,
  answerQuestion,
} from '../controllers/mentor.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Public/Learner routes
router.get('/mentors', authMiddleware, getAllMentors);
router.post('/learners/assign-mentor', authMiddleware, authorize('learner'), assignMentor);
router.delete('/learners/:id/mentor', authMiddleware, authorize('learner'), removeMentor);
router.get('/feedback/my-feedback', authMiddleware, authorize('learner'), getMyFeedback);

// Q&A - Learner routes
router.post('/questions', authMiddleware, authorize('learner'), askQuestion);
router.get('/questions/my-questions', authMiddleware, authorize('learner'), getMyQuestions);

// Mentor-only routes
router.get('/mentors/my-learners', authMiddleware, authorize('mentor'), getMyLearners);
router.get('/learners/:id/progress', authMiddleware, authorize('mentor'), getLearnerProgress);
router.post('/learners/:id/feedback', authMiddleware, authorize('mentor'), leaveFeedback);

// Q&A - Mentor routes
router.get('/questions/learner/:learnerId', authMiddleware, authorize('mentor'), getLearnerQuestions);
router.post('/questions/:questionId/answer', authMiddleware, authorize('mentor'), answerQuestion);

export default router;
