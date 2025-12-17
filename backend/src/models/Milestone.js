import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
    },
    description: {
      type: String,
    },
    targetDate: {
      type: Date,
      required: [true, 'Target date is required'],
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
milestoneSchema.index({ userId: 1, targetDate: 1 });

const Milestone = mongoose.model('Milestone', milestoneSchema);

export default Milestone;
