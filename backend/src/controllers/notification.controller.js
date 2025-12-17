import Notification from '../models/Notification.js';
import Milestone from '../models/Milestone.js';

// GET /api/notifications - Get user's notifications
export const getUserNotifications = async (req, res) => {
  try {
    const { limit, unreadOnly } = req.query;

    const filter = { userId: req.user.id };
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    let query = Notification.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const notifications = await query;

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      message: 'Failed to fetch notifications.',
      error: error.message,
    });
  }
};

// GET /api/notifications/unread-count - Get count of unread notifications
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      message: 'Failed to get unread count.',
      error: error.message,
    });
  }
};

// PATCH /api/notifications/:id/read - Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      message: 'Failed to mark notification as read.',
      error: error.message,
    });
  }
};

// POST /api/notifications/mark-all-read - Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });

    res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      message: 'Failed to mark all as read.',
      error: error.message,
    });
  }
};

// DELETE /api/notifications/:id - Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.status(200).json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      message: 'Failed to delete notification.',
      error: error.message,
    });
  }
};

// Utility function to check and create overdue milestone notifications
export const checkOverdueMilestones = async () => {
  try {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Find milestones that became overdue in the last 24 hours
    const overdueMilestones = await Milestone.find({
      status: { $in: ['pending', 'in-progress'] },
      targetDate: { $gte: yesterday, $lt: now },
    }).populate('userId', 'name');

    for (const milestone of overdueMilestones) {
      // Check if notification already exists
      const existingNotification = await Notification.findOne({
        userId: milestone.userId,
        type: 'milestone_overdue',
        relatedId: milestone._id,
      });

      if (!existingNotification) {
        await Notification.create({
          userId: milestone.userId,
          type: 'milestone_overdue',
          title: 'Milestone Overdue',
          message: `Your milestone "${milestone.title}" is overdue!`,
          relatedId: milestone._id,
          relatedModel: 'Milestone',
          link: '/milestones',
        });
      }
    }

    console.log(`✅ Checked ${overdueMilestones.length} overdue milestones`);
  } catch (error) {
    console.error('Check overdue milestones error:', error);
  }
};
