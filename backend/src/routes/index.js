import express from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import onboardingRoutes from './onboarding.routes.js';
import skillRoutes from './skill.routes.js';
import userSkillRoutes from './userSkill.routes.js';
import resourceRoutes from './resource.routes.js';
import enrollmentRoutes from './enrollment.routes.js';
import logRoutes from './log.routes.js';
import milestoneRoutes from './milestone.routes.js';
import sharingRoutes from './sharing.routes.js';
import progressRoutes from './progress.routes.js';
import adminRoutes from './admin.routes.js';
import mentorRoutes from './mentor.routes.js';
import notificationRoutes from './notification.routes.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/skills', skillRoutes); // Skills has public GET, protected POST/PUT/DELETE

// Protected routes (require authentication)
router.use('/onboarding', authMiddleware, onboardingRoutes);
router.use('/user-skills', authMiddleware, userSkillRoutes);
router.use('/resources', authMiddleware, resourceRoutes);
router.use('/enrollments', authMiddleware, enrollmentRoutes);
router.use('/logs', authMiddleware, logRoutes);
router.use('/milestones', authMiddleware, milestoneRoutes);
router.use('/sharing', authMiddleware, sharingRoutes);
router.use('/progress', authMiddleware, progressRoutes);
router.use('/', mentorRoutes); // Mentor routes (includes /mentors and /learners)
router.use('/', notificationRoutes); // Notification routes

// Admin routes (require authentication + admin role)
router.use('/admin', adminRoutes);

export default router;
