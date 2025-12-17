import express from 'express';
import { getProgressSummary, getLearningStreak } from '../controllers/progress.controller.js';

const router = express.Router();

router.get('/summary', getProgressSummary);
router.get('/streak', getLearningStreak);

export default router;
