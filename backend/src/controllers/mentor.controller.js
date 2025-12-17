import User from '../models/User.js';
import UserSkill from '../models/UserSkill.js';
import LearningLog from '../models/LearningLog.js';
import Milestone from '../models/Milestone.js';
import Notification from '../models/Notification.js';
import MentorFeedback from '../models/MentorFeedback.js';
import MentorQuestion from '../models/MentorQuestion.js';

// DELETE /api/learners/:id/mentor - Remove mentor from learner
export const removeMentor = async (req, res) => {
  try {
    const learnerId = req.params.id;
    const requesterId = req.user.id;

    // Ensure the requester is the learner themselves
    if (learnerId !== requesterId.toString()) {
      return res.status(403).json({ message: 'You can only remove your own mentor.' });
    }

    const learner = await User.findById(learnerId);
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found.' });
    }

    if (!learner.mentorId) {
      return res.status(400).json({ message: 'No mentor assigned.' });
    }

    const mentorId = learner.mentorId;
    const mentor = await User.findById(mentorId);

    // Remove mentor
    learner.mentorId = null;
    await learner.save();

    // Create notifications
    if (mentor) {
      await Notification.create([
        {
          userId: learnerId,
          type: 'mentor_removed',
          title: 'Mentor Removed',
          message: `You removed ${mentor.name} as your mentor.`,
          link: '/profile',
        },
        {
          userId: mentorId,
          type: 'learner_removed',
          title: 'Learner Removed',
          message: `${learner.name} is no longer your learner.`,
          link: '/mentor/learners',
        },
      ]);
    }

    res.status(200).json({
      message: 'Mentor removed successfully.',
      learner: {
        _id: learner._id,
        name: learner.name,
        mentorId: null,
      },
    });
  } catch (error) {
    console.error('Remove mentor error:', error);
    res.status(500).json({
      message: 'Failed to remove mentor.',
      error: error.message,
    });
  }
};

// GET /api/mentors - Get all available mentors
export const getAllMentors = async (req, res) => {
  try {
    const mentors = await User.find({
      role: 'mentor',
      isAvailableForMentoring: true,
    })
      .select('name email specializations bio availability maxLearners')
      .sort({ name: 1 });

    // Get learner count for each mentor
    const mentorsWithCount = await Promise.all(
      mentors.map(async (mentor) => {
        const learnerCount = await User.countDocuments({ mentorId: mentor._id });
        return {
          ...mentor.toObject(),
          currentLearners: learnerCount,
          isAcceptingLearners: learnerCount < mentor.maxLearners,
        };
      })
    );

    res.status(200).json(mentorsWithCount);
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({
      message: 'Failed to fetch mentors.',
      error: error.message,
    });
  }
};

// POST /api/learners/assign-mentor - Assign mentor to learner
export const assignMentor = async (req, res) => {
  try {
    const { mentorId } = req.body;
    const learnerId = req.user.id;

    if (!mentorId) {
      return res.status(400).json({ message: 'Mentor ID is required.' });
    }

    // Check if mentor exists and is available
    const mentor = await User.findOne({
      _id: mentorId,
      role: 'mentor',
      isAvailableForMentoring: true,
    });

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found or unavailable.' });
    }

    // Check if mentor has capacity
    const currentLearners = await User.countDocuments({ mentorId: mentor._id });
    if (currentLearners >= mentor.maxLearners) {
      return res.status(400).json({ message: 'Mentor has reached maximum capacity.' });
    }

    // Update learner's mentor
    const learner = await User.findByIdAndUpdate(
      learnerId,
      { mentorId: mentor._id },
      { new: true }
    ).select('name email mentorId');

    // Create notifications
    await Notification.create([
      {
        userId: learnerId,
        type: 'mentor_assigned',
        title: 'Mentor Assigned',
        message: `${mentor.name} is now your mentor!`,
        relatedId: mentor._id,
        relatedModel: 'User',
        link: '/dashboard',
      },
      {
        userId: mentor._id,
        type: 'learner_assigned',
        title: 'New Learner Assigned',
        message: `${learner.name} has selected you as their mentor.`,
        relatedId: learner._id,
        relatedModel: 'User',
        link: '/mentor/learners',
      },
    ]);

    res.status(200).json({
      message: 'Mentor assigned successfully.',
      learner,
      mentor: {
        _id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        specializations: mentor.specializations,
      },
    });
  } catch (error) {
    console.error('Assign mentor error:', error);
    res.status(500).json({
      message: 'Failed to assign mentor.',
      error: error.message,
    });
  }
};

// GET /api/mentors/my-learners - Get mentor's assigned learners
export const getMyLearners = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const learners = await User.find({ mentorId })
      .select('name email headline experienceLevel createdAt')
      .sort({ name: 1 });

    // Get progress summary for each learner
    const learnersWithProgress = await Promise.all(
      learners.map(async (learner) => {
        const [skillsCount, totalLogs, activeMilestones] = await Promise.all([
          UserSkill.countDocuments({ userId: learner._id }),
          LearningLog.countDocuments({ userId: learner._id }),
          Milestone.countDocuments({
            userId: learner._id,
            status: { $in: ['pending', 'in-progress'] },
          }),
        ]);

        // Get total hours this week
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const logsThisWeek = await LearningLog.find({
          userId: learner._id,
          date: { $gte: weekStart },
        });
        const hoursThisWeek = logsThisWeek.reduce((sum, log) => sum + log.durationMinutes, 0) / 60;

        return {
          ...learner.toObject(),
          progress: {
            skillsCount,
            totalLogs,
            activeMilestones,
            hoursThisWeek: parseFloat(hoursThisWeek.toFixed(1)),
          },
        };
      })
    );

    res.status(200).json(learnersWithProgress);
  } catch (error) {
    console.error('Get my learners error:', error);
    res.status(500).json({
      message: 'Failed to fetch learners.',
      error: error.message,
    });
  }
};

// GET /api/learners/:id/progress - Get detailed progress for a specific learner (mentor only)
export const getLearnerProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.user.id;

    // Verify the learner is assigned to this mentor
    const learner = await User.findOne({ _id: id, mentorId })
      .select('name email headline bio experienceLevel learningGoals weeklyLearningHoursGoal');

    if (!learner) {
      return res.status(404).json({
        message: 'Learner not found or not assigned to you.',
      });
    }

    // Get all progress data
    const [skills, logs, milestones] = await Promise.all([
      UserSkill.find({ userId: id })
        .populate('skillId', 'name category')
        .sort({ createdAt: -1 }),
      LearningLog.find({ userId: id })
        .populate('skillId', 'name category')
        .sort({ date: -1 })
        .limit(20),
      Milestone.find({ userId: id })
        .populate('skillId', 'name category')
        .sort({ targetDate: 1 }),
    ]);

    // Calculate stats
    const totalHours = logs.reduce((sum, log) => sum + log.durationMinutes, 0) / 60;
    const completedMilestones = milestones.filter((m) => m.status === 'completed').length;

    // Get mentor feedback for this learner
    const feedback = await MentorFeedback.find({ learnerId: id })
      .populate('mentorId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      learner,
      skills,
      recentLogs: logs,
      milestones,
      feedback,
      stats: {
        totalSkills: skills.length,
        totalLogs: logs.length,
        totalHours: parseFloat(totalHours.toFixed(1)),
        totalMilestones: milestones.length,
        completedMilestones,
      },
    });
  } catch (error) {
    console.error('Get learner progress error:', error);
    res.status(500).json({
      message: 'Failed to fetch learner progress.',
      error: error.message,
    });
  }
};

// POST /api/learners/:id/feedback - Leave feedback for a learner (mentor only)
export const leaveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.user.id;
    const { message, type } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Feedback message is required.' });
    }

    // Verify the learner is assigned to this mentor
    const learner = await User.findOne({ _id: id, mentorId });
    if (!learner) {
      return res.status(404).json({
        message: 'Learner not found or not assigned to you.',
      });
    }

    // Get mentor name for notification
    const mentor = await User.findById(mentorId).select('name');

    // Create feedback
    const feedback = await MentorFeedback.create({
      mentorId,
      learnerId: id,
      message: message.trim(),
      type: type || 'feedback',
    });

    // Create notification for learner
    await Notification.create({
      userId: id,
      type: 'mentor_feedback',
      title: 'New Mentor Feedback',
      message: `${mentor.name} left you feedback: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
      link: '/dashboard',
    });

    res.status(201).json({
      message: 'Feedback sent successfully.',
      feedback: await feedback.populate('mentorId', 'name'),
    });
  } catch (error) {
    console.error('Leave feedback error:', error);
    res.status(500).json({
      message: 'Failed to send feedback.',
      error: error.message,
    });
  }
};

// GET /api/feedback/my-feedback - Get all feedback received by the learner
export const getMyFeedback = async (req, res) => {
  try {
    const learnerId = req.user.id;

    const feedback = await MentorFeedback.find({ learnerId })
      .populate('mentorId', 'name email specializations')
      .sort({ createdAt: -1 });

    res.status(200).json(feedback);
  } catch (error) {
    console.error('Get my feedback error:', error);
    res.status(500).json({
      message: 'Failed to fetch feedback.',
      error: error.message,
    });
  }
};

// POST /api/mentor/ask-question - Learner asks mentor a question
export const askQuestion = async (req, res) => {
  try {
    const learnerId = req.user.id;
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: 'Question is required.' });
    }

    // Get learner's mentor
    const learner = await User.findById(learnerId).select('mentorId name');
    if (!learner || !learner.mentorId) {
      return res.status(400).json({ message: 'You do not have a mentor assigned.' });
    }

    const mentor = await User.findById(learner.mentorId).select('name');

    // Create question
    const mentorQuestion = await MentorQuestion.create({
      learnerId,
      mentorId: learner.mentorId,
      question: question.trim(),
    });

    // Notify mentor
    await Notification.create({
      userId: learner.mentorId,
      type: 'mentor_feedback',
      title: 'New Question from Learner',
      message: `${learner.name} asked: "${question.substring(0, 50)}${question.length > 50 ? '...' : ''}"`,
      link: '/mentor',
    });

    res.status(201).json({
      message: 'Question sent to mentor successfully.',
      question: await mentorQuestion.populate('mentorId', 'name'),
    });
  } catch (error) {
    console.error('Ask question error:', error);
    res.status(500).json({
      message: 'Failed to send question.',
      error: error.message,
    });
  }
};

// GET /api/mentor/my-questions - Get all questions asked by learner
export const getMyQuestions = async (req, res) => {
  try {
    const learnerId = req.user.id;

    const questions = await MentorQuestion.find({ learnerId })
      .populate('mentorId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (error) {
    console.error('Get my questions error:', error);
    res.status(500).json({
      message: 'Failed to fetch questions.',
      error: error.message,
    });
  }
};

// GET /api/mentor/learner-questions/:learnerId - Get all questions from a specific learner (mentor only)
export const getLearnerQuestions = async (req, res) => {
  try {
    const { learnerId } = req.params;
    const mentorId = req.user.id;

    // Verify learner is assigned to this mentor
    const learner = await User.findOne({ _id: learnerId, mentorId });
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found or not assigned to you.' });
    }

    const questions = await MentorQuestion.find({ learnerId, mentorId })
      .populate('learnerId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (error) {
    console.error('Get learner questions error:', error);
    res.status(500).json({
      message: 'Failed to fetch questions.',
      error: error.message,
    });
  }
};

// POST /api/mentor/answer-question/:questionId - Mentor answers a question
export const answerQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const mentorId = req.user.id;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: 'Reply is required.' });
    }

    // Find question and verify it belongs to this mentor
    const question = await MentorQuestion.findOne({ _id: questionId, mentorId });
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    // Update question with reply
    question.reply = reply.trim();
    question.isAnswered = true;
    question.answeredAt = new Date();
    await question.save();

    // Get mentor name for notification
    const mentor = await User.findById(mentorId).select('name');
    
    // Notify learner
    await Notification.create({
      userId: question.learnerId,
      type: 'mentor_feedback',
      title: 'Mentor Answered Your Question',
      message: `${mentor.name} replied: "${reply.substring(0, 50)}${reply.length > 50 ? '...' : ''}"`,
      link: '/dashboard',
    });

    res.status(200).json({
      message: 'Question answered successfully.',
      question: await question.populate('learnerId mentorId', 'name'),
    });
  } catch (error) {
    console.error('Answer question error:', error);
    res.status(500).json({
      message: 'Failed to answer question.',
      error: error.message,
    });
  }
};
