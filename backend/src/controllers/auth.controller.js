import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, gender, role = 'learner' } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Name, email, and password are required.' 
      });
    }

    // Validate role
    if (role && !['learner', 'mentor'].includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role. Must be either learner or mentor.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists.' 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      passwordHash,
      gender,
      role: role || 'learner',
    });

    // Generate token
    const token = generateToken(user);

    // Return response
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        headline: user.headline,
        bio: user.bio,
        interests: user.interests,
        learningGoals: user.learningGoals,
        experienceLevel: user.experienceLevel,
        weeklyLearningHoursGoal: user.weeklyLearningHoursGoal,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        privacySettings: user.privacySettings,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Registration failed.', 
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required.' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password.' 
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password.' 
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return response
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        headline: user.headline,
        bio: user.bio,
        interests: user.interests,
        learningGoals: user.learningGoals,
        experienceLevel: user.experienceLevel,
        weeklyLearningHoursGoal: user.weeklyLearningHoursGoal,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        privacySettings: user.privacySettings,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed.', 
      error: error.message 
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // Find user by ID from auth middleware
    const user = await User.findById(req.user.id).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found.' 
      });
    }

    // Return full user object
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        headline: user.headline,
        bio: user.bio,
        interests: user.interests,
        learningGoals: user.learningGoals,
        experienceLevel: user.experienceLevel,
        weeklyLearningHoursGoal: user.weeklyLearningHoursGoal,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        privacySettings: user.privacySettings,
        mentorId: user.mentorId,
        specializations: user.specializations,
        availability: user.availability,
        isAvailableForMentoring: user.isAvailableForMentoring,
        maxLearners: user.maxLearners,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user information.', 
      error: error.message 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if email is being changed
    const emailChanged = email && email !== user.email;
    
    // If email is being changed, require password verification
    if (emailChanged) {
      if (!password) {
        return res.status(400).json({ 
          message: 'Password is required to change email address.' 
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          message: 'Incorrect password.' 
        });
      }

      // Check if new email is already taken
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Email is already in use by another account.' 
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    // Return updated user
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      headline: user.headline,
      bio: user.bio,
      interests: user.interests,
      learningGoals: user.learningGoals,
      experienceLevel: user.experienceLevel,
      weeklyLearningHoursGoal: user.weeklyLearningHoursGoal,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      privacySettings: user.privacySettings,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Failed to update profile.', 
      error: error.message 
    });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { 
      weeklyLearningHoursGoal, 
      experienceLevel, 
      interests, 
      learningGoals,
      bio,
      specializations,
      availability,
      maxLearners,
      isAvailableForMentoring
    } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update learner preferences
    if (weeklyLearningHoursGoal !== undefined) {
      user.weeklyLearningHoursGoal = weeklyLearningHoursGoal;
    }
    if (experienceLevel) {
      user.experienceLevel = experienceLevel;
    }
    if (interests !== undefined) {
      user.interests = interests;
    }
    if (learningGoals !== undefined) {
      user.learningGoals = learningGoals;
    }

    // Update mentor preferences
    if (bio !== undefined) {
      user.bio = bio;
    }
    if (specializations !== undefined) {
      user.specializations = specializations;
    }
    if (availability !== undefined) {
      user.availability = availability;
    }
    if (maxLearners !== undefined) {
      user.maxLearners = maxLearners;
    }
    if (isAvailableForMentoring !== undefined) {
      user.isAvailableForMentoring = isAvailableForMentoring;
    }

    await user.save();

    // Return updated user with all fields
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      headline: user.headline,
      bio: user.bio,
      interests: user.interests,
      learningGoals: user.learningGoals,
      experienceLevel: user.experienceLevel,
      weeklyLearningHoursGoal: user.weeklyLearningHoursGoal,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      privacySettings: user.privacySettings,
      createdAt: user.createdAt,
    };

    // Add mentor-specific fields if user is a mentor
    if (user.role === 'mentor') {
      userResponse.specializations = user.specializations;
      userResponse.availability = user.availability;
      userResponse.maxLearners = user.maxLearners;
      userResponse.isAvailableForMentoring = user.isAvailableForMentoring;
    }

    res.status(200).json(userResponse);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ 
      message: 'Failed to update preferences.', 
      error: error.message 
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    console.log('Change password - userId:', userId);

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required.' 
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long.' 
      });
    }

    // Find user
    const user = await User.findById(userId);
    console.log('Change password - user found:', !!user);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Current password is incorrect.' 
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    res.status(200).json({ 
      message: 'Password changed successfully.' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: 'Failed to change password.', 
      error: error.message 
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    console.log('Delete account - userId:', userId);

    // Validate password
    if (!password) {
      return res.status(400).json({ 
        message: 'Password is required to delete account.' 
      });
    }

    // Find user
    const user = await User.findById(userId);
    console.log('Delete account - user found:', !!user);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Password is incorrect.' 
      });
    }

    // Delete all related data
    // Import models dynamically to avoid circular dependencies
    const UserSkill = (await import('../models/UserSkill.js')).default;
    const LearningLog = (await import('../models/LearningLog.js')).default;
    const Milestone = (await import('../models/Milestone.js')).default;
    const Enrollment = (await import('../models/Enrollment.js')).default;

    // Delete in parallel
    await Promise.all([
      UserSkill.deleteMany({ userId }),
      LearningLog.deleteMany({ userId }),
      Milestone.deleteMany({ userId }),
      Enrollment.deleteMany({ userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.status(200).json({ 
      message: 'Account and all associated data deleted successfully.' 
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      message: 'Failed to delete account.', 
      error: error.message 
    });
  }
};
