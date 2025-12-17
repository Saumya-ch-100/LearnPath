import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['learner', 'mentor', 'admin'],
      default: 'learner',
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
    },
    headline: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
    },
    interests: {
      type: [String],
      default: [],
    },
    learningGoals: {
      type: [String],
      default: [],
    },
    weeklyLearningHoursGoal: {
      type: Number,
      default: 0,
    },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', ''],
      default: '',
    },
    hasCompletedOnboarding: {
      type: Boolean,
      default: false,
    },
    // Learner-specific: Assigned mentor
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Mentor-specific fields
    specializations: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      default: '',
    },
    isAvailableForMentoring: {
      type: Boolean,
      default: true,
    },
    maxLearners: {
      type: Number,
      default: 10,
    },
    privacySettings: {
      showSkills: { type: Boolean, default: true },
      showLogs: { type: Boolean, default: false },
      showHours: { type: Boolean, default: true },
      showHistory: { type: Boolean, default: true },
      showBadges: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster email lookup
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
