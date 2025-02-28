const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
  entry: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  mood: String,
  moodIntensity: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  prompts: [{
    question: String,
    answer: String
  }],
  journalType: {
    type: String,
    enum: ['free', 'guided', 'gratitude', 'reflection', 'growth', 'mindfulness', 'creativity'],
    default: 'free'
  }
});

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema); 