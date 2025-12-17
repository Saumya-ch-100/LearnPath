import Enrollment from '../models/Enrollment.js';

// POST /api/enrollments - Create enrollment
export const createEnrollment = async (req, res) => {
  try {
    const { resourceId } = req.body;

    if (!resourceId) {
      return res.status(400).json({ 
        message: 'Resource ID is required.' 
      });
    }

    // Check if already enrolled
    let enrollment = await Enrollment.findOne({
      userId: req.user.id,
      resourceId,
    });

    if (enrollment) {
      return res.status(400).json({ 
        message: 'Already enrolled in this resource.' 
      });
    }

    // Create new enrollment
    enrollment = await Enrollment.create({
      userId: req.user.id,
      resourceId,
      status: 'enrolled',
    });

    await enrollment.populate('resourceId', 'title type provider level estimatedHours');

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Create enrollment error:', error);
    res.status(500).json({ 
      message: 'Failed to create enrollment.', 
      error: error.message 
    });
  }
};

// GET /api/enrollments - Get user's enrollments
export const getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate('resourceId', 'title type provider level estimatedHours url')
      .sort({ createdAt: -1 });

    res.status(200).json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch enrollments.', 
      error: error.message 
    });
  }
};

// PATCH /api/enrollments/:id - Update enrollment
export const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progressPercent } = req.body;

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({ 
        message: 'Enrollment not found.' 
      });
    }

    // Check ownership
    if (enrollment.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'You do not have permission to update this enrollment.' 
      });
    }

    // Update status
    if (status) {
      enrollment.status = status;
      
      // Set startedAt when moving to in-progress
      if (status === 'in-progress' && !enrollment.startedAt) {
        enrollment.startedAt = new Date();
      }
      
      // Set completedAt when marking as completed
      if (status === 'completed' && !enrollment.completedAt) {
        enrollment.completedAt = new Date();
      }
    }

    // Update progress
    if (progressPercent !== undefined) {
      enrollment.progressPercent = progressPercent;
    }

    await enrollment.save();
    await enrollment.populate('resourceId', 'title type provider level estimatedHours url');

    res.status(200).json(enrollment);
  } catch (error) {
    console.error('Update enrollment error:', error);
    res.status(500).json({ 
      message: 'Failed to update enrollment.', 
      error: error.message 
    });
  }
};
