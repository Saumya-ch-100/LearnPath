import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    parentSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      default: null,
    },
    levelScale: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 5 },
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

// Index for faster queries
skillSchema.index({ name: 1, category: 1 });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
