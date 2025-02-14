const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  mood: {
    type: String,
    required: true,
    enum: ['Happy', 'Calm', 'Sad', 'Anxious', 'Energetic', 'Tired']
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  note: {
    type: String
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema); 