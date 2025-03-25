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
    type: String,  // Changed from Date to String for easier matching
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('MorningThought', morningThoughtSchema); 