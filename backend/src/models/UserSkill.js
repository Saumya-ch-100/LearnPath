import mongoose from 'mongoose';

const userSkillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    currentLevel: {
      type: Number,
      required: [true, 'Current level is required'],
    },
    targetLevel: {
      type: Number,
      required: [true, 'Target level is required'],
    },
    notes: {
      type: String,
    },
    progressPercent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index for userId + skillId combination
userSkillSchema.index({ userId: 1, skillId: 1 }, { unique: true });

// Pre-save hook to calculate progress percentage
userSkillSchema.pre('save', function (next) {
  if (this.targetLevel > 0 && this.currentLevel > 0) {
    this.progressPercent = Math.min(
      Math.round((this.currentLevel / this.targetLevel) * 100),
      100
    );
  }
  next();
});

const UserSkill = mongoose.model('UserSkill', userSkillSchema);

export default UserSkill;
