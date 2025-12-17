import User from '../models/User.js';

/**
 * Complete onboarding - Update user profile with onboarding data
 */
export const completeOnboarding = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle mentor onboarding
    if (user.role === 'mentor') {
      const { bio, specializations, availability, maxLearners, isAvailableForMentoring } = req.body;

      // Validate required fields for mentor
      if (!bio || bio.trim().length < 20) {
        return res.status(400).json({ message: 'Bio must be at least 20 characters' });
      }

      if (!specializations || specializations.length === 0) {
        return res.status(400).json({ message: 'Please select at least one specialization' });
      }

      if (!availability) {
        return res.status(400).json({ message: 'Please select your availability' });
      }

      // Update mentor
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          bio,
          specializations,
          availability,
          maxLearners: maxLearners || 5,
          isAvailableForMentoring: isAvailableForMentoring !== false,
          hasCompletedOnboarding: true,
        },
        { new: true, runValidators: true }
      ).select('-passwordHash');

      return res.json({
        message: 'Mentor onboarding completed successfully',
        user: updatedUser,
      });
    }

    // Handle learner onboarding
    const { interests, learningGoals, weeklyLearningHoursGoal, experienceLevel } = req.body;

    // Validate required fields for learner
    if (!interests || interests.length === 0) {
      return res.status(400).json({ message: 'Please select at least one interest' });
    }

    if (!experienceLevel) {
      return res.status(400).json({ message: 'Please select your experience level' });
    }

    // Update learner
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        interests,
        learningGoals: learningGoals || [],
        weeklyLearningHoursGoal: weeklyLearningHoursGoal || 0,
        experienceLevel,
        hasCompletedOnboarding: true,
      },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({
      message: 'Onboarding completed successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ message: 'Server error during onboarding' });
  }
};

/**
 * Skip onboarding - Mark as completed without collecting data
 */
export const skipOnboarding = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { hasCompletedOnboarding: true },
      { new: true }
    ).select('-passwordHash');

    res.json({
      message: 'Onboarding skipped',
      user,
    });
  } catch (error) {
    console.error('Skip onboarding error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get onboarding status
 */
export const getOnboardingStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('hasCompletedOnboarding interests learningGoals experienceLevel');

    res.json({
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      needsOnboarding: !user.hasCompletedOnboarding,
      profile: {
        interests: user.interests,
        learningGoals: user.learningGoals,
        experienceLevel: user.experienceLevel,
      },
    });
  } catch (error) {
    console.error('Get onboarding status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
