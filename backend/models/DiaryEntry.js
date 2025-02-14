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
  mood: {
    type: String,
    enum: ['Happy', 'Calm', 'Sad', 'Anxious', 'Energetic', 'Tired']
  },
  moodIntensity: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema); 