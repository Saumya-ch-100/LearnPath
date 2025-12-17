import mongoose from 'mongoose';
import LearningLog from '../models/LearningLog.js';
import Enrollment from '../models/Enrollment.js';

// GET /api/progress/streak - Get learning streak
export const getLearningStreak = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Get all dates when user logged learning (sorted desc)
    const logs = await LearningLog.aggregate([
      {
        $match: { userId: userId }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    if (logs.length === 0) {
      return res.status(200).json({ streak: 0, lastLogDate: null });
    }

    // Convert date strings to Date objects
    const logDates = logs.map(log => new Date(log._id));
    
    // Check if most recent log is today or yesterday (otherwise streak is broken)
    const mostRecentLog = logDates[0];
    const daysDiff = Math.floor((now - mostRecentLog) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) {
      // Streak broken (last log was 2+ days ago)
      return res.status(200).json({ streak: 0, lastLogDate: mostRecentLog });
    }

    // Calculate consecutive days
    let streak = 1;
    for (let i = 1; i < logDates.length; i++) {
      const currentDate = logDates[i];
      const previousDate = logDates[i - 1];
      const diff = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        streak++;
      } else {
        break; // Streak broken
      }
    }

    res.status(200).json({ 
      streak, 
      lastLogDate: mostRecentLog,
      includesCurrentDay: daysDiff === 0
    });
  } catch (error) {
    console.error('Get learning streak error:', error);
    res.status(500).json({ 
      message: 'Failed to calculate learning streak.', 
      error: error.message 
    });
  }
};

// GET /api/progress/summary - Get progress summary
export const getProgressSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();
    const { range = '7d' } = req.query;

    // Calculate date ranges based on range parameter
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Determine chart date range based on query parameter
    let chartStartDate;
    switch(range) {
      case '7d':
        chartStartDate = new Date(now);
        chartStartDate.setDate(now.getDate() - 7);
        break;
      case '14d':
        chartStartDate = new Date(now);
        chartStartDate.setDate(now.getDate() - 14);
        break;
      case '30d':
        chartStartDate = new Date(now);
        chartStartDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        chartStartDate = new Date(now);
        chartStartDate.setDate(now.getDate() - 90);
        break;
      case 'all':
        chartStartDate = new Date(0); // Beginning of time
        break;
      default:
        chartStartDate = new Date(now);
        chartStartDate.setDate(now.getDate() - 7);
    }

    const logsByDay = await LearningLog.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: chartStartDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          totalMinutes: { $sum: '$durationMinutes' }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalMinutes: 1
        }
      }
    ]);

    // 2. Hours by skill
    const logsBySkill = await LearningLog.aggregate([
      {
        $match: {
          userId: userId,
          skillId: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$skillId',
          totalMinutes: { $sum: '$durationMinutes' }
        }
      },
      {
        $lookup: {
          from: 'skills',
          localField: '_id',
          foreignField: '_id',
          as: 'skill'
        }
      },
      {
        $unwind: '$skill'
      },
      {
        $project: {
          _id: 0,
          skillId: '$_id',
          skillName: '$skill.name',
          totalMinutes: 1
        }
      },
      {
        $sort: { totalMinutes: -1 }
      }
    ]);

    // 3. Resources summary
    const enrollmentCounts = await Enrollment.aggregate([
      {
        $match: { userId: userId }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const resourcesSummary = {
      enrolled: 0,
      inProgress: 0,
      completed: 0
    };

    enrollmentCounts.forEach(item => {
      if (item._id === 'enrolled') resourcesSummary.enrolled = item.count;
      if (item._id === 'in-progress') resourcesSummary.inProgress = item.count;
      if (item._id === 'completed') resourcesSummary.completed = item.count;
    });

    // 4. Total minutes this week
    const weekLogs = await LearningLog.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: '$durationMinutes' }
        }
      }
    ]);

    const totalMinutesThisWeek = weekLogs[0]?.totalMinutes || 0;

    // 5. Total minutes this month
    const monthLogs = await LearningLog.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: '$durationMinutes' }
        }
      }
    ]);

    const totalMinutesThisMonth = monthLogs[0]?.totalMinutes || 0;

    // Convert minutes to hours for the response
    const hoursByDay = logsByDay.map(log => ({
      date: log.date,
      hours: parseFloat((log.totalMinutes / 60).toFixed(2))
    }));

    const hoursBySkill = logsBySkill.map(log => ({
      skillId: log.skillId,
      skillName: log.skillName,
      hours: parseFloat((log.totalMinutes / 60).toFixed(2))
    }));

    // Construct response
    res.status(200).json({
      hoursByDay,
      hoursBySkill,
      resourcesSummary,
      totalMinutesThisWeek,
      totalMinutesThisMonth,
    });
  } catch (error) {
    console.error('Get progress summary error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch progress summary.', 
      error: error.message 
    });
  }
};
