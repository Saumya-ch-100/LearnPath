import mongoose from 'mongoose';

const mentorFeedbackSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['feedback', 'encouragement', 'suggestion', 'concern'],
      default: 'feedback',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
mentorFeedbackSchema.index({ learnerId: 1, createdAt: -1 });
mentorFeedbackSchema.index({ mentorId: 1, createdAt: -1 });

const MentorFeedback = mongoose.model('MentorFeedback', mentorFeedbackSchema);

export default MentorFeedback;
