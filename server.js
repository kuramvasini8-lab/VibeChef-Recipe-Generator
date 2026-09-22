require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");

const Recipe = require("./models/Recipe");

const app = express();
const port = process.env.PORT || 3000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

app.post("/api/generate-recipe", async (req, res) => {
  try {
    const {
      ingredients,
      cuisine,
      diet,
      cookingTime,
      difficulty
    } = req.body;

    if (!ingredients || !ingredients.trim()) {
      return res.status(400).json({
        error: "Please enter at least one ingredient."
      });
    }

    const prompt = `
You are VibeChef, an expert culinary assistant.

Create one practical and delicious recipe based on these requirements.

Available ingredients:
${ingredients}

Cuisine:
${cuisine || "Any Cuisine"}

Dietary preference:
${diet || "No Preference"}

Maximum cooking time:
${cookingTime || "30 minutes"}

Difficulty:
${difficulty || "Easy"}

Return the recipe using this structure:

RECIPE TITLE:
A creative recipe name

DESCRIPTION:
A short description

TIME:
Estimated cooking time

DIFFICULTY:
Difficulty level

INGREDIENTS:
List ingredients with quantities

INSTRUCTIONS:
Give clear numbered cooking steps

CHEF'S TIP:
Give one useful cooking tip

Rules:
- Respect the dietary preference.
- Use the provided ingredients where possible.
- Keep the recipe within the requested cooking time.
- Do not include ingredients that conflict with the dietary preference.
- Keep instructions simple and practical.
- Do not add unnecessary explanations.
`;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You are VibeChef, an expert culinary assistant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      stream: true
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");

    for await (const chunk of completion) {
      const text = chunk.choices[0]?.delta?.content || "";

      if (text) {
        res.write(text);
      }
    }

    res.end();
  } catch (error) {
    console.error("Recipe generation error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Unable to generate recipe. Please try again."
      });
    } else {
      res.end();
    }
  }
});

app.post("/api/customize-recipe", async (req, res) => {
  try {
    const {
      recipe,
      modification
    } = req.body;

    if (!recipe || !modification) {
      return res.status(400).json({
        error: "Recipe and modification are required."
      });
    }

    const prompt = `
You are VibeChef, an expert culinary assistant.

The user has generated the following recipe:

${recipe}

The user wants this modification:

${modification}

Modify the recipe according to the user's request.

Important rules:
- Keep the main dish and overall recipe recognizable.
- Keep the original ingredients where possible.
- Only change what is necessary to satisfy the requested modification.
- Maintain the same recipe structure.
- If making it healthier, suggest practical healthier substitutions.
- If making it faster, simplify cooking steps and reduce preparation time.
- If changing spice or salt levels, adjust the relevant ingredients and quantities.
- Return only the updated recipe.

Use this structure:

RECIPE TITLE:
Updated recipe name

DESCRIPTION:
Short description

TIME:
Estimated cooking time

DIFFICULTY:
Difficulty level

INGREDIENTS:
List ingredients with quantities

INSTRUCTIONS:
Clear numbered cooking steps

CHEF'S TIP:
One useful cooking tip
`;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You are VibeChef, an expert recipe customization assistant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      stream: true
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");

    for await (const chunk of completion) {
      const text = chunk.choices[0]?.delta?.content || "";

      if (text) {
        res.write(text);
      }
    }

    res.end();
  } catch (error) {
    console.error("Recipe customization error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Unable to customize recipe."
      });
    } else {
      res.end();
    }
  }
});

app.post("/api/recipes", async (req, res) => {
  try {
    const {
      title,
      content,
      ingredients,
      cuisine,
      diet,
      cookingTime,
      difficulty
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "Recipe title and content are required."
      });
    }

    const recipe = await Recipe.create({
      title,
      content,
      ingredients: ingredients || "",
      cuisine: cuisine || "Any Cuisine",
      diet: diet || "No Preference",
      cookingTime: cookingTime || "30 minutes",
      difficulty: difficulty || "Easy"
    });

    res.status(201).json({
      message: "Recipe saved successfully.",
      recipe
    });
  } catch (error) {
    console.error("Save recipe error:", error);

    res.status(500).json({
      error: "Unable to save recipe."
    });
  }
});

app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    console.error("Get recipes error:", error);

    res.status(500).json({
      error: "Unable to load saved recipes."
    });
  }
});

app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        error: "Recipe not found."
      });
    }

    res.json(recipe);
  } catch (error) {
    console.error("Get single recipe error:", error);

    res.status(500).json({
      error: "Unable to load recipe."
    });
  }
});

app.delete("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        error: "Recipe not found."
      });
    }

    res.json({
      message: "Recipe deleted successfully."
    });
  } catch (error) {
    console.error("Delete recipe error:", error);

    res.status(500).json({
      error: "Unable to delete recipe."
    });
  }
});

app.delete("/api/recipes", async (req, res) => {
  try {
    await Recipe.deleteMany({});

    res.json({
      message: "All recipes deleted successfully."
    });
  } catch (error) {
    console.error("Clear recipes error:", error);

    res.status(500).json({
      error: "Unable to clear recipes."
    });
  }
});

app.listen(port, () => {
  console.log(`VibeChef running at http://localhost:${port}`);
});