import mongoose from 'mongoose';

const learningLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
learningLogSchema.index({ userId: 1, date: -1 });
learningLogSchema.index({ skillId: 1 });
learningLogSchema.index({ resourceId: 1 });

const LearningLog = mongoose.model('LearningLog', learningLogSchema);

export default LearningLog;
