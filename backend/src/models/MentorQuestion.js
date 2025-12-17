import mongoose from 'mongoose';

const mentorQuestionSchema = new mongoose.Schema(
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
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    reply: {
      type: String,
      trim: true,
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
    answeredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
mentorQuestionSchema.index({ learnerId: 1, createdAt: -1 });
mentorQuestionSchema.index({ mentorId: 1, isAnswered: 1, createdAt: -1 });

const MentorQuestion = mongoose.model('MentorQuestion', mentorQuestionSchema);

export default MentorQuestion;
