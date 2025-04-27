const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  deadline: {
    type: Date
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  subTasks: [{
    description: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  progressHistory: [{
    date: Date,
    progress: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal; 