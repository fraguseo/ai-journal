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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema); 