const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const mongoose = require('mongoose');
const DiaryEntry = require('./models/DiaryEntry');

dotenv.config();

const app = express();
app.use(cors({
  origin: '*',  // Be more specific in production
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Update the MongoDB connection with options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.post("/api/analyze", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not set');
    }

    const { entry } = req.body;
    if (!entry) {
      throw new Error('No entry provided');
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a thoughtful journaling assistant. Provide empathetic, insightful responses to journal entries. Focus on emotional support and gentle guidance for self-reflection."
        },
        {
          role: "user",
          content: entry
        }
      ],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: error.message || "Failed to analyze journal entry" });
  }
});

// Update the diary endpoint to include AI mood analysis
app.post("/api/diary", async (req, res) => {
  try {
    const { entry, date } = req.body;

    // First, get AI to analyze the mood
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a mood analyzer. Analyze the text and respond with only a JSON object containing: mood (one of: Happy, Calm, Sad, Anxious, Energetic, Tired) and intensity (1-5). Example: {\"mood\": \"Happy\", \"intensity\": 4}"
        },
        {
          role: "user",
          content: entry
        }
      ],
    });

    // Parse the AI response
    const moodAnalysis = JSON.parse(completion.choices[0].message.content);
    
    // Create new diary entry with mood
    const diaryEntry = new DiaryEntry({
      entry,
      date: new Date(date),
      mood: moodAnalysis.mood,
      moodIntensity: moodAnalysis.intensity
    });

    // Save to database
    await diaryEntry.save();
    
    res.json({ 
      message: "Entry saved successfully",
      mood: moodAnalysis.mood,
      intensity: moodAnalysis.intensity
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to save diary entry" });
  }
});

// Update the GET endpoint to accept a date query
app.get("/api/diary", async (req, res) => {
  try {
    const { date } = req.query;
    let entries;
    
    if (date) {
      // If date is provided, find entries for that date
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setDate(endOfDay.getDate() + 1);
      
      entries = await DiaryEntry.find({
        date: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }).sort({ date: -1 });
    } else {
      // If no date, return all entries
      entries = await DiaryEntry.find().sort({ date: -1 });
    }
    
    res.json(entries);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch diary entries" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
