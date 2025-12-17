import mongoose from 'mongoose';

const sharedAccessSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scope: {
      type: String,
      enum: ['all', 'skills-only', 'logs-only'],
      default: 'all',
    },
  },
  {
    timestamps: true,
  }
);

// Unique index for learnerId + mentorId combination
sharedAccessSchema.index({ learnerId: 1, mentorId: 1 }, { unique: true });

const SharedAccess = mongoose.model('SharedAccess', sharedAccessSchema);

export default SharedAccess;
