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

// Update the diary endpoint to save to MongoDB
app.post("/api/diary", async (req, res) => {
  try {
    const { entry, date } = req.body;
    
    // Create new diary entry
    const diaryEntry = new DiaryEntry({
      entry,
      date: new Date(date)
    });

    // Save to database
    await diaryEntry.save();
    
    res.json({ message: "Entry saved successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to save diary entry" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
