import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['course', 'book', 'tutorial', 'video'],
      required: [true, 'Resource type is required'],
    },
    provider: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    estimatedHours: {
      type: Number,
    },
    skillIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    }],
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    isExternal: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for filtering
resourceSchema.index({ type: 1, level: 1 });
resourceSchema.index({ skillIds: 1 });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
