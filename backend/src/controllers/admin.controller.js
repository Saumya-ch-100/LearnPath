import User from '../models/User.js';
import UserSkill from '../models/UserSkill.js';
import LearningLog from '../models/LearningLog.js';
import Milestone from '../models/Milestone.js';
import Enrollment from '../models/Enrollment.js';

// GET /api/admin/users - Get all users with pagination and filters
export const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      role, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Get users
    const users = await User.find(filter)
      .select('-passwordHash')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch users.', 
      error: error.message 
    });
  }
};

// GET /api/admin/users/:id - Get user details
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get user statistics
    const [skillsCount, logsCount, milestonesCount, enrollmentsCount] = await Promise.all([
      UserSkill.countDocuments({ userId: user._id }),
      LearningLog.countDocuments({ userId: user._id }),
      Milestone.countDocuments({ userId: user._id }),
      Enrollment.countDocuments({ userId: user._id })
    ]);

    // Get total learning hours
    const logsAgg = await LearningLog.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: null, totalMinutes: { $sum: '$durationMinutes' } } }
    ]);
    const totalHours = logsAgg.length > 0 ? Math.round(logsAgg[0].totalMinutes / 60) : 0;

    res.json({
      ...user.toObject(),
      stats: {
        skills: skillsCount,
        logs: logsCount,
        milestones: milestonesCount,
        enrollments: enrollmentsCount,
        totalLearningHours: totalHours
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user.', 
      error: error.message 
    });
  }
};

// PATCH /api/admin/users/:id - Update user (including role)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, interests, learningGoals, weeklyLearningHoursGoal, experienceLevel } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent self-demotion (admin removing their own admin role)
    if (req.user.id === user._id.toString() && role && role !== user.role) {
      return res.status(400).json({ 
        message: 'Cannot change your own role. Ask another admin to do this.' 
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) {
      // Check if email already exists
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use.' });
      }
      user.email = email;
    }
    if (role) user.role = role;
    if (interests) user.interests = interests;
    if (learningGoals) user.learningGoals = learningGoals;
    if (weeklyLearningHoursGoal !== undefined) user.weeklyLearningHoursGoal = weeklyLearningHoursGoal;
    if (experienceLevel) user.experienceLevel = experienceLevel;

    await user.save();

    res.json({ 
      message: 'User updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      message: 'Failed to update user.', 
      error: error.message 
    });
  }
};

// DELETE /api/admin/users/:id - Delete user and all related data
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent self-deletion
    if (req.user.id === user._id.toString()) {
      return res.status(400).json({ 
        message: 'Cannot delete your own account. Ask another admin to do this.' 
      });
    }

    // Delete all user-related data
    await Promise.all([
      UserSkill.deleteMany({ userId: user._id }),
      LearningLog.deleteMany({ userId: user._id }),
      Milestone.deleteMany({ userId: user._id }),
      Enrollment.deleteMany({ userId: user._id }),
      User.findByIdAndDelete(user._id)
    ]);

    res.json({ 
      message: 'User and all related data deleted successfully.',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      message: 'Failed to delete user.', 
      error: error.message 
    });
  }
};

// GET /api/admin/analytics - Get system-wide analytics
export const getSystemAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalSkills,
      totalResources,
      totalLogs,
      roleDistribution,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      UserSkill.countDocuments(),
      Enrollment.countDocuments(),
      LearningLog.countDocuments(),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      User.find()
        .select('name email role createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    // Calculate total learning hours across platform
    const totalHoursAgg = await LearningLog.aggregate([
      { $group: { _id: null, totalMinutes: { $sum: '$durationMinutes' } } }
    ]);
    const totalLearningHours = totalHoursAgg.length > 0 
      ? Math.round(totalHoursAgg[0].totalMinutes / 60) 
      : 0;

    // Format role distribution
    const roles = {};
    roleDistribution.forEach(item => {
      roles[item._id] = item.count;
    });

    res.json({
      totalUsers,
      totalSkills,
      totalResources,
      totalLogs,
      totalLearningHours,
      roleDistribution: {
        learners: roles.learner || 0,
        mentors: roles.mentor || 0,
        admins: roles.admin || 0
      },
      recentUsers
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch analytics.', 
      error: error.message 
    });
  }
};
