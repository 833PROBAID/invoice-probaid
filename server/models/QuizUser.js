const mongoose = require('mongoose');

const quizUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true,
    enum: ['executor', 'trustee', 'administrator', 'beneficiary', 'attorney', 'real-estate-agent', 'other']
  },
  additionalInfo: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster lookups
quizUserSchema.index({ email: 1 });
quizUserSchema.index({ createdAt: -1 });

module.exports = mongoose.model('QuizUser', quizUserSchema);
