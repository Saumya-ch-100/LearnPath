import express from 'express';
import { completeOnboarding, skipOnboarding, getOnboardingStatus } from '../controllers/onboarding.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/onboarding/complete - Complete onboarding with data
router.post('/complete', completeOnboarding);

// POST /api/onboarding/skip - Skip onboarding
router.post('/skip', skipOnboarding);

// GET /api/onboarding/status - Check if user needs onboarding
router.get('/status', getOnboardingStatus);

export default router;
