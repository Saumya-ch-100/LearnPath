import SharedAccess from '../models/SharedAccess.js';
import User from '../models/User.js';

// POST /api/sharing/share-with-mentor - Share access with mentor
export const shareWithMentor = async (req, res) => {
  try {
    const { mentorEmail, scope } = req.body;

    if (!mentorEmail) {
      return res.status(400).json({ 
        message: 'Mentor email is required.' 
      });
    }

    // Find mentor by email and role
    const mentor = await User.findOne({ 
      email: mentorEmail.toLowerCase().trim(),
      role: 'mentor'
    });

    if (!mentor) {
      return res.status(404).json({ 
        message: 'Mentor not found with this email.' 
      });
    }

    // Check if sharing with self
    if (mentor._id.toString() === req.user.id) {
      return res.status(400).json({ 
        message: 'Cannot share with yourself.' 
      });
    }

    // Create or update shared access
    let sharedAccess = await SharedAccess.findOne({
      learnerId: req.user.id,
      mentorId: mentor._id,
    });

    if (sharedAccess) {
      // Update existing
      if (scope) sharedAccess.scope = scope;
      await sharedAccess.save();
    } else {
      // Create new
      sharedAccess = await SharedAccess.create({
        learnerId: req.user.id,
        mentorId: mentor._id,
        scope: scope || 'all',
      });
    }

    await sharedAccess.populate('mentorId', 'name email');

    res.status(200).json({
      message: 'Access shared successfully.',
      sharedAccess,
    });
  } catch (error) {
    console.error('Share with mentor error:', error);
    res.status(500).json({ 
      message: 'Failed to share access.', 
      error: error.message 
    });
  }
};

// GET /api/mentor/learners - Get learners sharing with this mentor
export const getMentorLearners = async (req, res) => {
  try {
    const sharedAccesses = await SharedAccess.find({ 
      mentorId: req.user.id 
    })
      .populate('learnerId', 'name email headline bio')
      .sort({ createdAt: -1 });

    res.status(200).json(sharedAccesses);
  } catch (error) {
    console.error('Get mentor learners error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch learners.', 
      error: error.message 
    });
  }
};

// DELETE /api/sharing/revoke/:mentorId - Revoke mentor access
export const revokeAccess = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const sharedAccess = await SharedAccess.findOneAndDelete({
      learnerId: req.user.id,
      mentorId,
    });

    if (!sharedAccess) {
      return res.status(404).json({ 
        message: 'Shared access not found.' 
      });
    }

    res.status(200).json({ 
      message: 'Access revoked successfully.' 
    });
  } catch (error) {
    console.error('Revoke access error:', error);
    res.status(500).json({ 
      message: 'Failed to revoke access.', 
      error: error.message 
    });
  }
};
