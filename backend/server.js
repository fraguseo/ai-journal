const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const mongoose = require('mongoose');
const DiaryEntry = require('./models/DiaryEntry');
const Recipe = require('./models/Recipe');
const MorningThought = require('./models/MorningThought');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const app = express();
app.use(cors({
  origin: ['https://journalprototype.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Add this near the top of server.js, after the imports
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

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
        dietary: "vegetarian",
        ingredients: ["macaroni", "cheese", "milk", "butter", "breadcrumbs"],
        instructions: [
          "Boil water in a large pot and add salt",
          "Cook macaroni according to package instructions until al dente",
          "In a separate pan, melt butter over medium heat",
          "Whisk in flour to make a roux and cook for 2 minutes",
          "Gradually add warm milk while whisking to prevent lumps",
          "Add cheese and stir until melted and smooth",
          "Combine sauce with cooked pasta",
          "Top with breadcrumbs and bake at 350°F for 20 minutes until golden"
        ],
        prepTime: 30,
        imageUrl: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Energizing Smoothie Bowl",
        mood: "Happy",
        description: "Start your day with this vibrant smoothie bowl",
        dietary: "vegan",
        ingredients: ["banana", "berries", "yogurt", "granola", "honey"],
        instructions: [
          "Freeze banana and berries overnight",
          "Blend frozen fruits with yogurt until smooth but thick",
          "Add a splash of milk if needed for blending",
          "Pour into a bowl and smooth the surface",
          "Arrange fresh berries in a circular pattern",
          "Sprinkle granola around the edges",
          "Drizzle honey in a zigzag pattern",
          "Serve immediately while cold and thick"
        ],
        prepTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1626790680787-de5e9a07bcf2?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Calming Chamomile Tea",
        mood: "Anxious",
        description: "A soothing tea blend to help you relax",
        dietary: "vegan",
        ingredients: ["chamomile tea", "honey", "lemon", "lavender"],
        instructions: [
          "Bring fresh water to a near boil (around 200°F)",
          "Place chamomile tea bag in your favorite mug",
          "Pour hot water over the tea bag and let steep for 3-5 minutes",
          "Remove tea bag and add 1-2 teaspoons of honey to taste",
          "Squeeze half a lemon for a citrus boost",
          "Optional: add a small sprig of fresh lavender",
          "Let cool for 2-3 minutes before enjoying"
        ],
        prepTime: 5,
        imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Energy-Boosting Trail Mix",
        mood: "Tired",
        description: "A nutrient-rich snack to boost your energy",
        dietary: "vegan",
        ingredients: ["nuts", "dried fruits", "dark chocolate", "seeds"],
        instructions: [
          "Toast nuts in a dry pan over medium heat for 5-7 minutes until fragrant",
          "Let nuts cool completely (about 15 minutes)",
          "Chop any larger nuts into bite-sized pieces",
          "Mix equal parts nuts and dried fruits in a large bowl",
          "Add dark chocolate chips (about 1/4 of the total mixture)",
          "Sprinkle in seeds for extra nutrition",
          "Store in an airtight container for up to 2 weeks"
        ],
        prepTime: 10,
        imageUrl: "https://images.unsplash.com/photo-1623428187969-5da2dcea5eaa?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Peaceful Green Tea",
        mood: "Calm",
        description: "A mindful cup of green tea for tranquility",
        dietary: "vegan",
        ingredients: ["green tea", "mint leaves", "ginger", "honey"],
        instructions: [
          "Heat water to 175°F (not boiling) for optimal green tea brewing",
          "Place green tea bag and 2-3 fresh mint leaves in your cup",
          "Add a thin slice of fresh ginger",
          "Pour hot water over and steep for exactly 2 minutes",
          "Remove tea bag and ginger slice",
          "Stir in honey to taste (about 1 teaspoon)",
          "Let cool for 1-2 minutes before enjoying"
        ],
        prepTime: 8,
        imageUrl: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Power Protein Bowl",
        mood: "Energetic",
        description: "A protein-packed bowl to maintain your energy",
        ingredients: ["quinoa", "chicken", "avocado", "vegetables"],
        instructions: [
          "Rinse quinoa thoroughly under cold water",
          "Cook quinoa in vegetable broth for extra flavor (2:1 ratio, 15 minutes)",
          "Season chicken breast with salt, pepper, and herbs",
          "Grill chicken for 6-7 minutes per side until cooked through",
          "Slice chicken and avocado",
          "Steam or roast your choice of vegetables",
          "Layer quinoa in bowl, arrange chicken and vegetables",
          "Top with sliced avocado and your favorite sauce"
        ],
        prepTime: 25,
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
      },
      // Additional Happy recipes
      {
        name: "Rainbow Fruit Salad",
        mood: "Happy",
        dietary: "vegan",
        description: "A colorful mix of fresh fruits to brighten your day",
        ingredients: ["strawberries", "mango", "blueberries", "kiwi", "pineapple"],
        instructions: [
          "Wash all fruits thoroughly under cold water",
          "Hull and quarter strawberries",
          "Peel and cube mango into 1-inch pieces",
          "Peel and slice kiwi into half-moons",
          "Cut pineapple into bite-sized chunks",
          "Gently mix fruits in a large bowl",
          "Chiffonade fresh mint leaves for garnish",
          "Serve immediately or chill for up to 2 hours"
        ],
        prepTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=800&q=80"
      },
      
      // Additional Sad recipes
      {
        name: "Chocolate Chip Cookies",
        mood: "Sad",
        dietary: "vegetarian",
        description: "Warm, gooey cookies that feel like a hug",
        ingredients: ["flour", "butter", "chocolate chips", "brown sugar", "vanilla"],
        instructions: [
          "Preheat oven to 375°F and line baking sheets with parchment",
          "Cream butter and both sugars until light and fluffy (about 3 minutes)",
          "Beat in eggs one at a time, then add vanilla",
          "Mix dry ingredients in separate bowl: flour, baking soda, salt",
          "Gradually add dry ingredients to wet mixture",
          "Fold in chocolate chips by hand",
          "Drop rounded tablespoons onto baking sheets",
          "Bake for 10-12 minutes until edges are golden brown"
        ],
        prepTime: 25,
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Anxious recipes
      {
        name: "Lavender Latte",
        mood: "Anxious",
        description: "A soothing coffee drink with calming lavender",
        dietary: "vegetarian",
        ingredients: ["coffee", "milk", "lavender syrup", "honey"],
        instructions: [
          "Brew a strong shot of espresso or 4oz strong coffee",
          "Heat milk in a saucepan until steaming (not boiling)",
          "Add 1-2 pumps of lavender syrup to the hot coffee",
          "Froth the warm milk using a whisk or frother",
          "Pour coffee into your favorite mug",
          "Slowly add the frothed milk, holding back foam",
          "Spoon foam on top and drizzle with honey",
          "Optional: sprinkle dried lavender for garnish"
        ],
        prepTime: 10,
        imageUrl: "https://images.unsplash.com/photo-1545665277-5937489579f2?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Happy recipes
      {
        name: "Birthday Pancake Tower",
        mood: "Happy",
        description: "Colorful layered pancakes with sprinkles and cream",
        dietary: "vegetarian",
        ingredients: ["pancake mix", "food coloring", "whipped cream", "sprinkles", "maple syrup", "butter"],
        instructions: [
          "Prepare pancake batter according to recipe or mix instructions",
          "Divide batter into 4 bowls and add different food coloring to each",
          "Heat non-stick pan or griddle to medium heat",
          "Pour 1/4 cup of each colored batter to make medium pancakes",
          "Cook until bubbles form, flip and cook other side",
          "Whip cream with vanilla and sugar until stiff peaks form",
          "Layer pancakes with whipped cream between each layer",
          "Top with extra cream, sprinkles, and a birthday candle"
        ],
        prepTime: 45,
        imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Summer Lemonade Slush",
        mood: "Happy",
        dietary: "vegan",
        description: "Refreshing frozen lemonade with fresh mint",
        ingredients: ["lemons", "sugar", "mint", "ice", "water"],
        instructions: [
          "Make simple syrup by heating 1 cup water with 1 cup sugar until dissolved",
          "Let simple syrup cool completely (about 15 minutes)",
          "Juice 6-8 fresh lemons to get 1 cup of juice",
          "Blend 4 cups of ice with lemon juice and simple syrup",
          "Taste and adjust sweetness if needed",
          "Muddle fresh mint leaves in serving glasses",
          "Pour slush into glasses",
          "Garnish with lemon slices and mint sprigs"
        ],
        prepTime: 10,
        imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Sad recipes
      {
        name: "Loaded Baked Potato Soup",
        mood: "Sad",
        description: "Rich and creamy potato soup topped with cheese and bacon",
        ingredients: ["potatoes", "cream", "cheese", "bacon", "green onions", "sour cream"],
        instructions: [
          "Bake potatoes at 400°F for 1 hour until tender",
          "Cook diced bacon until crispy, set aside",
          "In same pot, sauté onions in bacon fat until soft",
          "Add flour to make roux, cook for 2 minutes",
          "Gradually whisk in chicken broth and cream",
          "Add chopped potatoes and simmer for 15 minutes",
          "Stir in cheese until melted",
          "Top with bacon, green onions, and sour cream"
        ],
        prepTime: 60,
        imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Nutella Hot Chocolate",
        mood: "Sad",
        description: "Decadent hot chocolate with Nutella and marshmallows",
        dietary: "vegetarian",
        ingredients: ["milk", "Nutella", "cocoa powder", "marshmallows", "whipped cream"],
        instructions: [
          "Heat milk in a saucepan over medium heat until steaming",
          "Whisk in 2 tablespoons Nutella until completely dissolved",
          "Add 1 tablespoon cocoa powder for extra richness",
          "Continue whisking until hot and smooth",
          "Pour into your favorite mug",
          "Top with a generous dollop of whipped cream",
          "Add mini marshmallows",
          "Optional: drizzle with extra melted Nutella"
        ],
        prepTime: 8,
        imageUrl: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Anxious recipes
      {
        name: "Stress-Relief Energy Balls",
        mood: "Anxious",
        description: "No-bake energy balls with calming ingredients",
        dietary: "vegan",
        ingredients: ["oats", "honey", "almond butter", "dark chocolate", "chia seeds", "lavender"],
        instructions: [
          "Pulse oats in food processor until finely ground",
          "Add honey and almond butter, pulse to combine",
          "Mix in dark chocolate chips and chia seeds",
          "Add a tiny pinch of culinary lavender (optional)",
          "Roll mixture into 1-inch balls",
          "Place on parchment-lined tray",
          "Refrigerate for at least 1 hour",
          "Store in airtight container for up to 1 week"
        ],
        prepTime: 20,
        imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Calming Banana Oatmeal",
        mood: "Anxious",
        description: "Warm oatmeal with banana and cinnamon",
        dietary: "vegetarian",
        ingredients: ["oats", "banana", "cinnamon", "honey", "almonds"],
        instructions: [
          "Bring 1 cup water and 1/2 cup milk to a gentle boil",
          "Add 1/2 cup rolled oats and reduce heat to medium-low",
          "Cook for 5 minutes, stirring occasionally",
          "Mash half a ripe banana and stir into oats",
          "Add 1/4 teaspoon cinnamon and a pinch of salt",
          "Top with remaining sliced banana",
          "Sprinkle with toasted almonds",
          "Finish with a drizzle of warm honey"
        ],
        prepTime: 12,
        imageUrl: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Tired recipes
      {
        name: "Energy Boost Breakfast Sandwich",
        mood: "Tired",
        description: "Protein-packed breakfast sandwich with avocado",
        dietary: "vegetarian",
        ingredients: ["eggs", "bread", "avocado", "cheese", "spinach", "hot sauce"],
        instructions: [
          "Toast two slices of whole grain bread until golden",
          "Mash half an avocado with salt and pepper",
          "Heat a non-stick pan over medium heat",
          "Crack two eggs into pan and cook to desired doneness",
          "Layer toast with mashed avocado, spinach leaves",
          "Add eggs and a slice of cheese",
          "Optional: add a dash of hot sauce",
          "Cut diagonally and serve immediately while warm"
        ],
        prepTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Quick Wake-Up Chia Pudding",
        mood: "Tired",
        description: "Easy overnight chia pudding with coffee",
        dietary: "vegetarian",
        ingredients: ["chia seeds", "coffee", "milk", "maple syrup", "cocoa"],
        instructions: [
          "Brew 1/2 cup strong coffee and let cool",
          "In a jar, combine 1/4 cup chia seeds with coffee and 1 cup milk",
          "Add 2 tablespoons maple syrup and 1 teaspoon cocoa powder",
          "Whisk well to prevent clumps",
          "Cover and refrigerate overnight (at least 6 hours)",
          "Stir well before serving",
          "Top with cocoa nibs or chocolate shavings",
          "Optional: add a dollop of whipped cream"
        ],
        prepTime: 5,
        imageUrl: "https://images.unsplash.com/photo-1542691457-cbe4df041eb2?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Calm recipes
      {
        name: "Zen Garden Sushi Bowl",
        mood: "Calm",
        description: "Deconstructed sushi bowl with fresh ingredients",
        ingredients: ["sushi rice", "salmon", "avocado", "cucumber", "nori", "soy sauce"],
        instructions: [
          "Rinse sushi rice until water runs clear",
          "Cook rice with rice vinegar and salt according to package",
          "Slice salmon into thin pieces (or cook if preferred)",
          "Cut cucumber and avocado into thin strips",
          "Arrange rice in bowl, creating a base",
          "Place fish and vegetables in sections around the bowl",
          "Tear nori into small pieces and sprinkle",
          "Serve with soy sauce, wasabi, and pickled ginger"
        ],
        prepTime: 35,
        imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Mindful Mint Water",
        mood: "Calm",
        description: "Refreshing infused water with mint and cucumber",
        dietary: "vegan",
        ingredients: ["water", "mint leaves", "cucumber", "lemon", "ice"],
        instructions: [
          "Wash mint leaves and cucumber thoroughly",
          "Slice cucumber into thin rounds",
          "Cut lemon into thin wheels, remove seeds",
          "Layer ingredients in a large glass pitcher",
          "Fill with filtered water",
          "Gently press ingredients with wooden spoon to release flavors",
          "Refrigerate for at least 1 hour to infuse",
          "Serve over ice, garnish with fresh mint sprig"
        ],
        prepTime: 5,
        imageUrl: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80"
      },

      // Additional Energetic recipes
      {
        name: "Power-Up Protein Pancakes",
        mood: "Energetic",
        description: "High-protein pancakes with berry compote",
        dietary: "vegetarian",
        ingredients: ["protein powder", "oats", "egg whites", "berries", "greek yogurt"],
        instructions: [
          "Blend oats into a fine flour in food processor",
          "Mix with protein powder, baking powder, and cinnamon",
          "Whisk egg whites until slightly frothy",
          "Combine wet and dry ingredients until just mixed",
          "Heat non-stick pan over medium heat",
          "Pour 1/4 cup batter for each pancake",
          "Cook until bubbles form, then flip",
          "Serve with Greek yogurt and fresh berries"
        ],
        prepTime: 30,
        imageUrl: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Pre-Workout Energy Bites",
        mood: "Energetic",
        description: "Quick energy bites for an instant boost",
        dietary: "vegan",
        ingredients: ["dates", "nuts", "protein powder", "coconut", "coffee beans"],
        instructions: [
          "Soak dates in warm water for 10 minutes, then drain",
          "Process dates in food processor until paste forms",
          "Add nuts and protein powder, pulse until combined",
          "Add crushed coffee beans for extra energy",
          "Roll mixture into 1-inch balls",
          "Coat each ball in shredded coconut",
          "Place on lined tray and refrigerate for 30 minutes",
          "Store in airtight container in fridge for up to 2 weeks"
        ],
        prepTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80"
      },
      // Happy Mood
      {
        name: "Grilled Honey Lime Chicken Skewers",
        mood: "Happy",
        description: "Bright and zesty grilled chicken skewers with a tropical twist",
        ingredients: ["chicken breast", "lime", "honey", "soy sauce", "garlic", "bell peppers", "pineapple"],
        instructions: [
          "Cut chicken into 1-inch cubes",
          "Whisk honey, lime juice, soy sauce, and minced garlic for marinade",
          "Marinate chicken for 30 minutes to 2 hours",
          "Cut bell peppers and pineapple into chunks",
          "Thread chicken and vegetables onto skewers",
          "Preheat grill to medium-high heat",
          "Grill skewers for 12-15 minutes, turning occasionally",
          "Brush with remaining marinade during last 2 minutes"
        ],
        prepTime: 45,
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
      },

      // Sad Mood
      {
        name: "Classic Beef Stew",
        mood: "Sad",
        description: "Hearty beef stew that warms the soul",
        ingredients: ["beef chuck", "potatoes", "carrots", "onions", "beef broth", "red wine", "thyme"],
        instructions: [
          "Cut beef into 1.5-inch cubes and season with salt and pepper",
          "Brown beef in batches in a Dutch oven over medium-high heat",
          "Remove beef and sauté onions until softened",
          "Add wine to deglaze, scraping bottom of pot",
          "Return beef, add broth and herbs, simmer for 1.5 hours",
          "Add potatoes and carrots, cook 30-40 minutes more",
          "Check seasoning and adjust if needed",
          "Let rest 10 minutes before serving"
        ],
        prepTime: 150,
        imageUrl: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80"
      },

      // Anxious Mood
      {
        name: "Lemon Butter Salmon",
        mood: "Anxious",
        description: "Light and nourishing salmon with calming herbs",
        ingredients: ["salmon fillet", "lemon", "butter", "dill", "capers", "asparagus", "garlic"],
        instructions: [
          "Pat salmon dry and season with salt and pepper",
          "Melt butter with minced garlic in a large skillet",
          "Place salmon skin-side up in the pan",
          "Cook for 4 minutes until golden brown",
          "Flip salmon, add lemon slices and capers",
          "Steam asparagus alongside for 3-4 minutes",
          "Sprinkle fresh dill over everything",
          "Serve with lemon butter sauce drizzled on top"
        ],
        prepTime: 20,
        imageUrl: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=800&q=80"
      },

      // Tired Mood
      {
        name: "Spicy Tuna Rice Bowl",
        mood: "Tired",
        description: "Quick and energizing tuna bowl with a kick",
        ingredients: ["sushi-grade tuna", "sushi rice", "sriracha", "soy sauce", "seaweed", "sesame seeds", "green onions"],
        instructions: [
          "Cook sushi rice according to package instructions",
          "Cut tuna into 1/2-inch cubes",
          "Mix sriracha and soy sauce for spicy sauce",
          "Warm rice and place in serving bowl",
          "Top with fresh tuna cubes",
          "Drizzle with spicy sauce",
          "Garnish with sesame seeds and green onions",
          "Serve with crispy seaweed on the side"
        ],
        prepTime: 25,
        imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?auto=format&fit=crop&w=800&q=80"
      },

      // Calm Mood
      {
        name: "Herb-Roasted Chicken",
        mood: "Calm",
        description: "Simple and comforting roasted chicken with fresh herbs",
        ingredients: ["whole chicken", "rosemary", "thyme", "sage", "lemon", "garlic", "olive oil", "root vegetables"],
        instructions: [
          "Preheat oven to 375°F",
          "Pat chicken dry and stuff cavity with lemon and herbs",
          "Rub skin with olive oil, salt, and pepper",
          "Arrange root vegetables around chicken in roasting pan",
          "Roast for 1 hour and 15 minutes or until done",
          "Let rest for 15 minutes before carving",
          "Serve with roasted vegetables",
          "Drizzle with pan juices"
        ],
        prepTime: 90,
        imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80"
      },

      // Energetic Mood
      {
        name: "Grilled Chicken Fajitas",
        mood: "Energetic",
        description: "Sizzling chicken fajitas with colorful peppers",
        ingredients: ["chicken breast", "bell peppers", "onions", "lime", "tortillas", "guacamole", "salsa", "cilantro"],
        instructions: [
          "Marinate chicken in lime juice and spices for 30 minutes",
          "Slice peppers and onions into strips",
          "Grill chicken 5-6 minutes per side until cooked through",
          "Let chicken rest for 5 minutes before slicing",
          "Grill vegetables until charred and tender",
          "Warm tortillas on the grill",
          "Slice chicken into strips",
          "Serve with guacamole, salsa, and fresh cilantro"
        ],
        prepTime: 45,
        imageUrl: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=800&q=80"
      },
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
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);  // Exit if can't connect to database
});

// Add error handler for MongoDB
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Add this after your MongoDB connection setup
mongoose.connection.once('open', async () => {
  try {
    // Drop the existing unique index on date
    await MorningThought.collection.dropIndex('date_1');
    console.log('Dropped old index on MorningThought');
  } catch (error) {
    console.log('No existing index to drop');
  }
});

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
app.post("/api/diary", authenticateToken, async (req, res) => {
  try {
    const { entry, date, journalType, prompts } = req.body;
    
    console.log('Received diary entry:', { entry, date, journalType, prompts }); // Debug log
    
    if (!date) {
      throw new Error('Date is required');
    }

    // Validate prompts format
    if (prompts && !Array.isArray(prompts)) {
      throw new Error('Prompts must be an array');
    }

    // First, get AI to analyze the mood
    const moodCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a mood analyzer. Analyze the text and respond with only a JSON object containing: mood (one of: Happy, Calm, Sad, Anxious, Energetic, Tired) and intensity (1-5). Example: {\"mood\": \"Happy\", \"intensity\": 4}"
        },
        {
          role: "user",
          content: `${prompts?.map(p => p.answer).join(' ')} ${entry || ''}`
        }
      ],
    });

    try {
      const moodAnalysis = JSON.parse(moodCompletion.choices[0].message.content);
      console.log('Mood analysis:', moodAnalysis);

      if (!moodAnalysis.mood || !moodAnalysis.intensity) {
        throw new Error('Invalid mood analysis format');
      }

      const diaryEntry = new DiaryEntry({
        entry: entry || '',
        date: new Date(date),
        mood: moodAnalysis.mood,
        moodIntensity: moodAnalysis.intensity,
        journalType,
        prompts: prompts || [],
        userId: req.user.userId
      });

      console.log('Saving diary entry:', diaryEntry);
      const newEntry = await diaryEntry.save();
      console.log('Entry saved successfully');

      res.json({ 
        message: "Entry saved successfully",
        mood: moodAnalysis.mood,
        intensity: moodAnalysis.intensity
      });
    } catch (parseError) {
      console.error('Error parsing mood analysis:', parseError);
      throw new Error('Failed to analyze mood');
    }
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ 
      error: error.message || "Failed to save diary entry",
      details: error.stack
    });
  }
});

// Update the GET endpoint to filter by user and date
app.get('/api/diary', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;
    let entries;

    if (date) {
      // Create start and end of the selected date
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setDate(endOfDay.getDate() + 1);
      
      entries = await DiaryEntry.find({
        userId: req.user.userId,
        date: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }).sort({ date: -1 });
    } else {
      // If no date specified, get all entries for user
      entries = await DiaryEntry.find({ 
        userId: req.user.userId 
      }).sort({ date: -1 });
    }

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Add dream interpretation endpoint
app.post("/api/dream", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not set');
    }

    const { dream } = req.body;
    if (!dream) {
      throw new Error('No dream provided');
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a thoughtful dream interpreter. Provide insightful, meaningful interpretations of dreams. Consider symbolism, emotions, and personal growth. Be supportive and constructive in your analysis."
        },
        {
          role: "user",
          content: dream
        }
      ],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: error.message || "Failed to interpret dream" });
  }
});

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Update the mood analysis endpoint to ensure proper JSON formatting
app.get("/api/diary/mood-analysis", async (req, res) => {
  try {
    const recentEntries = await DiaryEntry.find()
      .sort({ date: -1 })
      .limit(7);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a mood analysis expert. Analyze the mood data and provide insights, trends, and suggestions. Respond ONLY with a JSON object containing these exact fields: trend (string), suggestions (string), warnings (string or null). Do not include markdown formatting or backticks."
        },
        {
          role: "user",
          content: JSON.stringify(recentEntries)
        }
      ],
    });

    // Parse the response more safely
    let analysis;
    try {
      const content = completion.choices[0].message.content;
      analysis = JSON.parse(content.replace(/```json|```/g, '').trim());
    } catch (parseError) {
      console.error("Parse error:", parseError);
      analysis = {
        trend: "unable to analyze",
        suggestions: "Unable to generate suggestions at this time",
        warnings: null
      };
    }

    res.json(analysis);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to analyze mood data" });
  }
});

// Add "On This Day" endpoint
app.get("/api/diary/on-this-day", async (req, res) => {
  try {
    const { date } = req.query;
    const currentDate = new Date(date);
    
    // Find entries from same day in previous years/months
    const entries = await DiaryEntry.find({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: "$date" }, { $dayOfMonth: currentDate }] },
          { $eq: [{ $month: "$date" }, { $month: currentDate }] },
          { $lt: ["$date", currentDate] }  // Only past entries
        ]
      }
    }).sort({ date: -1 });

    // Get AI insights about patterns
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a thoughtful journal analyst. Look at these entries from the same calendar day across different years/months. Identify patterns, growth, and provide gentle insights. Return as JSON with fields: patterns (string), insights (string), reflection (string)."
        },
        {
          role: "user",
          content: JSON.stringify(entries)
        }
      ],
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      entries,
      analysis
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch memory journal data" });
  }
});

// Update morning thoughts endpoints
app.post('/api/morning-thoughts', authenticateToken, async (req, res) => {
  try {
    const { thoughts, date } = req.body;
    console.log('Received thoughts:', { thoughts, date, userId: req.user.userId });

    // Validate input
    if (!Array.isArray(thoughts)) {
      throw new Error('Thoughts must be an array');
    }

    // Use findOneAndUpdate to handle both creation and update
    const result = await MorningThought.findOneAndUpdate(
      { 
        date: date,
        userId: req.user.userId 
      },
      { 
        thoughts: thoughts,
        userId: req.user.userId,
        date: date
      },
      { 
        new: true,
        upsert: true // Create if doesn't exist
      }
    );

    console.log('Saved result:', result);
    res.json(result);
  } catch (error) {
    console.error('Error saving thoughts:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/morning-thoughts', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;
    console.log('Fetching thoughts:', { date, userId: req.user.userId });

    const thought = await MorningThought.findOne({
      date: date,
      userId: req.user.userId
    }).lean(); // Add lean() to get plain JavaScript object

    console.log('Found thought:', thought);
    
    // Always return an object with a thoughts array
    const response = thought ? 
      { thoughts: thought.thoughts, date: thought.date } : 
      { thoughts: [], date };
      
    res.json(response);
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add speech-to-text endpoint
app.post("/api/speech-to-text", async (req, res) => {
  try {
    const audioBlob = req.body;
    // Here you would integrate with a speech-to-text service
    // For now, we'll return a placeholder
    res.json({ text: "Voice recorded thought..." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to convert speech to text" });
  }
});

// Add these endpoints before your existing routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Add health check endpoint
app.get('/api/health', authenticateToken, (req, res) => {
  try {
    console.log('Health check - Auth header:', req.headers.authorization);
    console.log('Health check - User:', req.user);
    res.json({ status: 'ok', user: req.user });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a test endpoint
app.get('/api/test-auth', authenticateToken, (req, res) => {
  try {
    console.log('Test auth - Headers:', req.headers);
    console.log('Test auth - User:', req.user);
    res.json({ 
      message: 'Auth working',
      user: req.user,
      headers: req.headers.authorization
    });
  } catch (error) {
    console.error('Test auth error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add debug endpoint
app.get('/api/debug-token', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.json({ 
        status: 'error',
        message: 'No token found'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.json({
        status: 'success',
        token: token.substring(0, 20) + '...',
        decoded
      });
    } catch (err) {
      return res.json({
        status: 'error',
        message: 'Invalid token',
        error: err.message
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// Update the AI chat endpoint to maintain conversation context
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;  // Add history parameter
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a friendly AI companion who's great at listening and having natural conversations. Keep your responses concise and relevant to what the user is saying. Don't ask multiple questions - focus on engaging with what they've shared. Use casual language and occasional emojis, but don't overdo it. If they share something personal, acknowledge it before moving the conversation forward. Be more like a friend having coffee together than an interviewer. Remember previous messages to maintain conversation flow."
        },
        ...history,  // Include previous messages
        {
          role: "user",
          content: message
        }
      ],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

// Add therapy chat endpoint
app.post("/api/therapy-chat", authenticateToken, async (req, res) => {
  try {
    const { message, sessionType, history } = req.body;

    let systemPrompt = "You are an empathetic AI therapy assistant. ";
    
    switch (sessionType) {
      case 'cbt':
        systemPrompt += "Guide the user through CBT exercises, helping identify thought patterns and develop coping strategies.";
        break;
      case 'reflection':
        systemPrompt += "Lead a guided reflection session, helping the user explore their thoughts and feelings deeply.";
        break;
      case 'anxiety':
        systemPrompt += "Focus on anxiety management techniques and help the user work through anxious thoughts.";
        break;
      case 'stress':
        systemPrompt += "Guide stress relief exercises and help develop stress management strategies.";
        break;
      default:
        systemPrompt += "Provide supportive, therapeutic responses while maintaining appropriate boundaries.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...history,
        {
          role: "user",
          content: message
        }
      ],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to get therapy response" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
