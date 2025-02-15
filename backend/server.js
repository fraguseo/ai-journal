const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const mongoose = require('mongoose');
const DiaryEntry = require('./models/DiaryEntry');
const Recipe = require('./models/Recipe');

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

// Add after mongoose connection setup
const initializeRecipes = async () => {
  try {
    // Clear existing recipes first
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    const sampleRecipes = [
      {
        name: "Comfort Mac and Cheese",
        mood: "Sad",
        description: "A warm, creamy mac and cheese to lift your spirits",
        ingredients: ["macaroni", "cheese", "milk", "butter", "breadcrumbs"],
        instructions: ["Boil pasta", "Make cheese sauce", "Combine and bake"],
        prepTime: 30,
        imageUrl: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Energizing Smoothie Bowl",
        mood: "Happy",
        description: "Start your day with this vibrant smoothie bowl",
        ingredients: ["banana", "berries", "yogurt", "granola", "honey"],
        instructions: ["Blend fruits", "Add toppings", "Enjoy!"],
        prepTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1626790680787-de5e9a07bcf2?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Calming Chamomile Tea",
        mood: "Anxious",
        description: "A soothing tea blend to help you relax",
        ingredients: ["chamomile tea", "honey", "lemon", "lavender"],
        instructions: ["Steep tea", "Add honey", "Optional: add lemon"],
        prepTime: 5,
        imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Energy-Boosting Trail Mix",
        mood: "Tired",
        description: "A nutrient-rich snack to boost your energy",
        ingredients: ["nuts", "dried fruits", "dark chocolate", "seeds"],
        instructions: ["Mix all ingredients", "Store in airtight container"],
        prepTime: 10,
        imageUrl: "https://images.unsplash.com/photo-1599598425947-5202edd56bdb?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Peaceful Green Tea",
        mood: "Calm",
        description: "A mindful cup of green tea for tranquility",
        ingredients: ["green tea", "mint leaves", "ginger", "honey"],
        instructions: ["Heat water", "Steep tea and mint", "Add honey to taste"],
        prepTime: 8,
        imageUrl: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Power Protein Bowl",
        mood: "Energetic",
        description: "A protein-packed bowl to maintain your energy",
        ingredients: ["quinoa", "chicken", "avocado", "vegetables"],
        instructions: ["Cook quinoa", "Grill chicken", "Assemble bowl"],
        prepTime: 25,
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
      },
      // Additional Happy recipes
      {
        name: "Rainbow Fruit Salad",
        mood: "Happy",
        description: "A colorful mix of fresh fruits to brighten your day",
        ingredients: ["strawberries", "mango", "blueberries", "kiwi", "pineapple"],
        instructions: ["Wash fruits", "Cut into bite-sized pieces", "Mix gently", "Add mint for garnish"],
        prepTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=800&q=80"
      },
      
      // Additional Sad recipes
      {
        name: "Chocolate Chip Cookies",
        mood: "Sad",
        description: "Warm, gooey cookies that feel like a hug",
        ingredients: ["flour", "butter", "chocolate chips", "brown sugar", "vanilla"],
        instructions: ["Mix ingredients", "Form cookie dough", "Bake until golden"],
        prepTime: 25,
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Anxious recipes
      {
        name: "Lavender Latte",
        mood: "Anxious",
        description: "A soothing coffee drink with calming lavender",
        ingredients: ["coffee", "milk", "lavender syrup", "honey"],
        instructions: ["Brew coffee", "Steam milk", "Add lavender", "Top with foam"],
        prepTime: 10,
        imageUrl: "https://images.unsplash.com/photo-1545665277-5937489579f2?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Happy recipes
      {
        name: "Birthday Pancake Tower",
        mood: "Happy",
        description: "Colorful layered pancakes with sprinkles and cream",
        ingredients: ["pancake mix", "food coloring", "whipped cream", "sprinkles", "maple syrup", "butter"],
        instructions: ["Make pancake batter", "Divide and color batches", "Cook each color", "Layer with cream", "Top with sprinkles"],
        prepTime: 45,
        imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Summer Lemonade Slush",
        mood: "Happy",
        description: "Refreshing frozen lemonade with fresh mint",
        ingredients: ["lemons", "sugar", "mint", "ice", "water"],
        instructions: ["Make simple syrup", "Squeeze lemons", "Blend with ice", "Garnish with mint"],
        prepTime: 10,
        imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Sad recipes
      {
        name: "Loaded Baked Potato Soup",
        mood: "Sad",
        description: "Rich and creamy potato soup topped with cheese and bacon",
        ingredients: ["potatoes", "cream", "cheese", "bacon", "green onions", "sour cream"],
        instructions: ["Cook potatoes", "Crisp bacon", "Make cream base", "Blend soup", "Add toppings"],
        prepTime: 60,
        imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Nutella Hot Chocolate",
        mood: "Sad",
        description: "Decadent hot chocolate with Nutella and marshmallows",
        ingredients: ["milk", "Nutella", "cocoa powder", "marshmallows", "whipped cream"],
        instructions: ["Heat milk", "Whisk in Nutella", "Add cocoa", "Top with marshmallows"],
        prepTime: 8,
        imageUrl: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Anxious recipes
      {
        name: "Stress-Relief Energy Balls",
        mood: "Anxious",
        description: "No-bake energy balls with calming ingredients",
        ingredients: ["oats", "honey", "almond butter", "dark chocolate", "chia seeds", "lavender"],
        instructions: ["Mix ingredients", "Form balls", "Chill", "Store in container"],
        prepTime: 20,
        imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Calming Banana Oatmeal",
        mood: "Anxious",
        description: "Warm oatmeal with banana and cinnamon",
        ingredients: ["oats", "banana", "cinnamon", "honey", "almonds"],
        instructions: ["Cook oats", "Mash banana", "Add toppings", "Drizzle honey"],
        prepTime: 12,
        imageUrl: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Tired recipes
      {
        name: "Energy Boost Breakfast Sandwich",
        mood: "Tired",
        description: "Protein-packed breakfast sandwich with avocado",
        ingredients: ["eggs", "bread", "avocado", "cheese", "spinach", "hot sauce"],
        instructions: ["Toast bread", "Cook eggs", "Mash avocado", "Assemble sandwich"],
        prepTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Quick Wake-Up Chia Pudding",
        mood: "Tired",
        description: "Easy overnight chia pudding with coffee",
        ingredients: ["chia seeds", "coffee", "milk", "maple syrup", "cocoa"],
        instructions: ["Mix ingredients", "Refrigerate overnight", "Top and serve"],
        prepTime: 5,
        imageUrl: "https://images.unsplash.com/photo-1509449307943-f45e6d5f9c0d?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Calm recipes
      {
        name: "Zen Garden Sushi Bowl",
        mood: "Calm",
        description: "Deconstructed sushi bowl with fresh ingredients",
        ingredients: ["sushi rice", "salmon", "avocado", "cucumber", "nori", "soy sauce"],
        instructions: ["Cook rice", "Prep ingredients", "Arrange bowl", "Add sauce"],
        prepTime: 35,
        imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Mindful Mint Water",
        mood: "Calm",
        description: "Refreshing infused water with mint and cucumber",
        ingredients: ["water", "mint leaves", "cucumber", "lemon", "ice"],
        instructions: ["Slice cucumber", "Add ingredients", "Infuse water", "Chill"],
        prepTime: 5,
        imageUrl: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Energetic recipes
      {
        name: "Power-Up Protein Pancakes",
        mood: "Energetic",
        description: "High-protein pancakes with berry compote",
        ingredients: ["protein powder", "oats", "egg whites", "berries", "greek yogurt"],
        instructions: ["Blend batter", "Cook pancakes", "Make compote", "Add toppings"],
        prepTime: 30,
        imageUrl: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Pre-Workout Energy Bites",
        mood: "Energetic",
        description: "Quick energy bites for an instant boost",
        ingredients: ["dates", "nuts", "protein powder", "coconut", "coffee beans"],
        instructions: ["Process dates", "Mix ingredients", "Form balls", "Roll in coconut"],
        prepTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1582037928769-171b0eae297d?auto=format&fit=crop&w=800&q=80"
      }
    ];

    for (const recipe of sampleRecipes) {
      const newRecipe = new Recipe(recipe);
      await newRecipe.save();
    }
    console.log('Sample recipes initialized successfully');
  } catch (error) {
    console.error('Error initializing recipes:', error);
  }
};

// Update the MongoDB connection with options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('Connected to MongoDB');
  initializeRecipes();
})
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

// Update stats endpoint to handle time periods
app.get("/api/diary/stats", async (req, res) => {
  try {
    const { period, date } = req.query;
    let startDate, endDate;
    
    if (period === 'day') {
      startDate = new Date(date);
      endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
    } else if (period === 'week') {
      startDate = new Date(date);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
    } else if (period === 'month') {
      startDate = new Date(date);
      startDate.setDate(1);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const stats = await DiaryEntry.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lt: endDate
          }
        }
      },
      {
        $group: {
          _id: "$mood",
          count: { $sum: 1 },
          averageIntensity: { $avg: "$moodIntensity" }
        }
      }
    ]);
    
    console.log(`${period} stats found:`, stats);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch mood statistics" });
  }
});

// Add endpoint to get recipes by mood
app.get("/api/recipes", async (req, res) => {
  try {
    const { mood } = req.query;
    const query = mood ? { mood } : {};
    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// Add endpoint to create recipes
app.post("/api/recipes", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.json(recipe);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
