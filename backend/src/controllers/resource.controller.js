import Resource from '../models/Resource.js';

// GET /api/resources - Get all resources with filters
export const getAllResources = async (req, res) => {
  try {
    const { skillId, type, level, provider } = req.query;
    
    // Build filter object
    const filter = {};
    if (skillId) filter.skillIds = skillId;
    if (type) filter.type = type;
    if (level) filter.level = level;
    if (provider) filter.provider = new RegExp(provider, 'i');

    const resources = await Resource.find(filter)
      .populate('skillIds', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json(resources);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch resources.', 
      error: error.message 
    });
  }
};

// GET /api/resources/:id - Get single resource
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id)
      .populate('skillIds', 'name category description');

    if (!resource) {
      return res.status(404).json({ 
        message: 'Resource not found.' 
      });
    }

    res.status(200).json(resource);
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch resource.', 
      error: error.message 
    });
  }
};

// POST /api/resources - Create new resource (admin only)
export const createResource = async (req, res) => {
  try {
    const { 
      title, 
      type, 
      provider, 
      url, 
      description, 
      estimatedHours, 
      skillIds, 
      level, 
      isExternal 
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({ 
        message: 'Title and type are required.' 
      });
    }

    const resource = await Resource.create({
      title,
      type,
      provider,
      url,
      description,
      estimatedHours,
      skillIds,
      level,
      isExternal,
      createdBy: req.user.id,
    });

    await resource.populate('skillIds', 'name category');

    res.status(201).json(resource);
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ 
      message: 'Failed to create resource.', 
      error: error.message 
    });
  }
};

// PATCH /api/resources/:id - Update resource (admin only)
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const resource = await Resource.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('skillIds', 'name category');

    if (!resource) {
      return res.status(404).json({ 
        message: 'Resource not found.' 
      });
    }

    res.status(200).json(resource);
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ 
      message: 'Failed to update resource.', 
      error: error.message 
    });
  }
};

// DELETE /api/resources/:id - Delete resource (admin only)
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findByIdAndDelete(id);

    if (!resource) {
      return res.status(404).json({ 
        message: 'Resource not found.' 
      });
    }

    res.status(200).json({ 
      message: 'Resource deleted successfully.' 
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ 
      message: 'Failed to delete resource.', 
      error: error.message 
    });
  }
};
