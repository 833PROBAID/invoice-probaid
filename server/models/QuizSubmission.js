const mongoose = require('mongoose');

const quizSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizUser',
    required: true
  },
  answers: {
    type: Map,
    of: Number,
    required: true
  },
  results: {
    totalPoints: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    band: {
      label: String,
      tier: String,
      message: String,
      cta: String
    },
    missingItems: [String],
    partialItems: [String],
    completeItems: [String],
    recommendations: [String],
    strategicFocus: [String],
    focusAreas: [{
      groupId: String,
      label: String,
      percent: Number
    }]
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster lookups (no unique constraint - allows multiple submissions)
quizSubmissionSchema.index({ userId: 1 });
quizSubmissionSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);
