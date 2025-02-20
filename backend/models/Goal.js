const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
  description: String,
  completed: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const progressEntrySchema = new mongoose.Schema({
  value: Number,
  date: { type: Date, default: Date.now }
});

const goalSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Personal', 'Health', 'Career', 'Learning'],
    required: true
  },
  deadline: {
    type: Date,
    required: false
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  subTasks: [subTaskSchema],
  progressHistory: [progressEntrySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Goal', goalSchema); 