import LearningLog from '../models/LearningLog.js';

// POST /api/logs - Create learning log
export const createLog = async (req, res) => {
  try {
    const { date, durationMinutes, resourceId, skillId, notes } = req.body;

    if (!date || !durationMinutes) {
      return res.status(400).json({ 
        message: 'Date and duration are required.' 
      });
    }

    const log = await LearningLog.create({
      userId: req.user.id,
      date,
      durationMinutes,
      resourceId,
      skillId,
      notes,
    });

    await log.populate([
      { path: 'resourceId', select: 'title type' },
      { path: 'skillId', select: 'name category' }
    ]);

    res.status(201).json(log);
  } catch (error) {
    console.error('Create log error:', error);
    res.status(500).json({ 
      message: 'Failed to create learning log.', 
      error: error.message 
    });
  }
};

// GET /api/logs - Get user's learning logs with filters
export const getUserLogs = async (req, res) => {
  try {
    const { from, to, skillId, resourceId, limit } = req.query;
    
    // Build filter
    const filter = { userId: req.user.id };
    
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    
    if (skillId) filter.skillId = skillId;
    if (resourceId) filter.resourceId = resourceId;

    let query = LearningLog.find(filter)
      .populate('resourceId', 'title type')
      .populate('skillId', 'name category')
      .sort({ date: -1 });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const logs = await query;

    res.status(200).json(logs);
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch learning logs.', 
      error: error.message 
    });
  }
};
