import express from 'express';
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/notifications', authMiddleware, getUserNotifications);
router.get('/notifications/unread-count', authMiddleware, getUnreadCount);
router.patch('/notifications/:id/read', authMiddleware, markAsRead);
router.post('/notifications/mark-all-read', authMiddleware, markAllAsRead);
router.delete('/notifications/:id', authMiddleware, deleteNotification);

export default router;
