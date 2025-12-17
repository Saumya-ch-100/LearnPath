import Skill from '../models/Skill.js';

// GET /api/skills - Get all skills (public)
export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find()
      .populate('parentSkill', 'name')
      .sort({ category: 1, name: 1 });

    res.status(200).json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch skills.', 
      error: error.message 
    });
  }
};

// POST /api/skills - Create new skill (admin only)
export const createSkill = async (req, res) => {
  try {
    const { name, category, description, parentSkill, levelScale } = req.body;

    if (!name) {
      return res.status(400).json({ 
        message: 'Skill name is required.' 
      });
    }

    const skill = await Skill.create({
      name,
      category,
      description,
      parentSkill,
      levelScale,
      createdBy: req.user.id,
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ 
      message: 'Failed to create skill.', 
      error: error.message 
    });
  }
};

// PATCH /api/skills/:id - Update skill (admin only)
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, parentSkill, levelScale } = req.body;

    const skill = await Skill.findByIdAndUpdate(
      id,
      { name, category, description, parentSkill, levelScale },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ 
        message: 'Skill not found.' 
      });
    }

    res.status(200).json(skill);
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ 
      message: 'Failed to update skill.', 
      error: error.message 
    });
  }
};

// DELETE /api/skills/:id - Delete skill (admin only)
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return res.status(404).json({ 
        message: 'Skill not found.' 
      });
    }

    res.status(200).json({ 
      message: 'Skill deleted successfully.' 
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ 
      message: 'Failed to delete skill.', 
      error: error.message 
    });
  }
};
