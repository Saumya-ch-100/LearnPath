import Milestone from '../models/Milestone.js';

// POST /api/milestones - Create milestone
export const createMilestone = async (req, res) => {
  try {
    const { title, targetDate, description, skillId, resourceId } = req.body;

    if (!title || !targetDate) {
      return res.status(400).json({ 
        message: 'Title and target date are required.' 
      });
    }

    const milestone = await Milestone.create({
      userId: req.user.id,
      title,
      targetDate,
      description,
      skillId,
      resourceId,
    });

    await milestone.populate([
      { path: 'skillId', select: 'name category' },
      { path: 'resourceId', select: 'title type' }
    ]);

    res.status(201).json(milestone);
  } catch (error) {
    console.error('Create milestone error:', error);
    res.status(500).json({ 
      message: 'Failed to create milestone.', 
      error: error.message 
    });
  }
};

// GET /api/milestones - Get user's milestones
export const getUserMilestones = async (req, res) => {
  try {
    const { limit } = req.query;
    
    console.log('📍 Fetching milestones for user:', req.user.id, 'with limit:', limit);
    
    let query = Milestone.find({ userId: req.user.id })
      .populate('skillId', 'name category')
      .populate('resourceId', 'title type')
      .sort({ createdAt: -1 }); // Most recent first
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const milestones = await query;
    
    console.log('📍 Found', milestones.length, 'milestones');

    // Add isOverdue computed field
    const now = new Date();
    const milestonesWithOverdue = milestones.map(milestone => {
      const milestoneObj = milestone.toObject();
      milestoneObj.isOverdue = 
        milestone.status !== 'completed' && 
        new Date(milestone.targetDate) < now;
      return milestoneObj;
    });

    res.status(200).json(milestonesWithOverdue);
  } catch (error) {
    console.error('Get milestones error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch milestones.', 
      error: error.message 
    });
  }
};

// PATCH /api/milestones/:id - Update milestone
export const updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, targetDate, status } = req.body;

    const milestone = await Milestone.findById(id);

    if (!milestone) {
      return res.status(404).json({ 
        message: 'Milestone not found.' 
      });
    }

    // Check ownership
    if (milestone.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'You do not have permission to update this milestone.' 
      });
    }

    // Update fields
    if (title) milestone.title = title;
    if (description !== undefined) milestone.description = description;
    if (targetDate) milestone.targetDate = targetDate;
    
    if (status) {
      milestone.status = status;
      
      // Set completedAt when marking as completed
      if (status === 'completed' && !milestone.completedAt) {
        milestone.completedAt = new Date();
      }
    }

    await milestone.save();
    await milestone.populate([
      { path: 'skillId', select: 'name category' },
      { path: 'resourceId', select: 'title type' }
    ]);

    // Add isOverdue
    const milestoneObj = milestone.toObject();
    milestoneObj.isOverdue = 
      milestone.status !== 'completed' && 
      new Date(milestone.targetDate) < new Date();

    res.status(200).json(milestoneObj);
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ 
      message: 'Failed to update milestone.', 
      error: error.message 
    });
  }
};
