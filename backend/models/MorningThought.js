const mongoose = require('mongoose');

const morningThoughtSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thoughts: [{
    type: String,
    required: true
  }],
  date: {
    type: String,
    required: true
  }
});

// Create a compound index on userId and date
morningThoughtSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MorningThought', morningThoughtSchema); 