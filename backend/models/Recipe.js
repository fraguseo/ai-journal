const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: ['Happy', 'Calm', 'Sad', 'Anxious', 'Energetic', 'Tired'],
    required: true
  },
  description: String,
  ingredients: [String],
  instructions: [String],
  prepTime: Number,  // in minutes
  imageUrl: String,
  tags: [String],
  dietary: String
});

module.exports = mongoose.model('Recipe', recipeSchema); 