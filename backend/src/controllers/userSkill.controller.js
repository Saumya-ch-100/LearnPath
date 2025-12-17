import UserSkill from '../models/UserSkill.js';

// GET /api/user-skills - Get user's skills
export const getUserSkills = async (req, res) => {
  try {
    const userSkills = await UserSkill.find({ userId: req.user.id })
      .populate('skillId', 'name category description levelScale')
      .sort({ createdAt: -1 });

    res.status(200).json(userSkills);
  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user skills.', 
      error: error.message 
    });
  }
};

// POST /api/user-skills - Create or update user skill
export const upsertUserSkill = async (req, res) => {
  try {
    const { skillId, currentLevel, targetLevel, notes } = req.body;

    if (!skillId || currentLevel === undefined || targetLevel === undefined) {
      return res.status(400).json({ 
        message: 'Skill ID, current level, and target level are required.' 
      });
    }

    // Check if user skill already exists
    let userSkill = await UserSkill.findOne({ 
      userId: req.user.id, 
      skillId 
    });

    if (userSkill) {
      // Update existing
      userSkill.currentLevel = currentLevel;
      userSkill.targetLevel = targetLevel;
      if (notes !== undefined) userSkill.notes = notes;
      await userSkill.save();
    } else {
      // Create new
      userSkill = await UserSkill.create({
        userId: req.user.id,
        skillId,
        currentLevel,
        targetLevel,
        notes,
      });
    }

    // Populate skill details
    await userSkill.populate('skillId', 'name category description levelScale');

    res.status(userSkill.isNew ? 201 : 200).json(userSkill);
  } catch (error) {
    console.error('Upsert user skill error:', error);
    res.status(500).json({ 
      message: 'Failed to save user skill.', 
      error: error.message 
    });
  }
};

// PATCH /api/user-skills/:id - Update user skill
export const updateUserSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentLevel, targetLevel, notes } = req.body;

    // Find user skill
    const userSkill = await UserSkill.findById(id);

    if (!userSkill) {
      return res.status(404).json({ 
        message: 'User skill not found.' 
      });
    }

    // Check ownership (or admin)
    if (userSkill.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'You do not have permission to update this skill.' 
      });
    }

    // Update fields
    if (currentLevel !== undefined) userSkill.currentLevel = currentLevel;
    if (targetLevel !== undefined) userSkill.targetLevel = targetLevel;
    if (notes !== undefined) userSkill.notes = notes;

    await userSkill.save();
    await userSkill.populate('skillId', 'name category description levelScale');

    res.status(200).json(userSkill);
  } catch (error) {
    console.error('Update user skill error:', error);
    res.status(500).json({ 
      message: 'Failed to update user skill.', 
      error: error.message 
    });
  }
};

// DELETE /api/user-skills/:id - Delete user skill
export const deleteUserSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const userSkill = await UserSkill.findById(id);

    if (!userSkill) {
      return res.status(404).json({ 
        message: 'User skill not found.' 
      });
    }

    // Check ownership (or admin)
    if (userSkill.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'You do not have permission to delete this skill.' 
      });
    }

    await userSkill.deleteOne();

    res.status(200).json({ 
      message: 'User skill deleted successfully.' 
    });
  } catch (error) {
    console.error('Delete user skill error:', error);
    res.status(500).json({ 
      message: 'Failed to delete user skill.', 
      error: error.message 
    });
  }
};
