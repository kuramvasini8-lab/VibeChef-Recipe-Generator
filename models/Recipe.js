const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    ingredients: {
      type: String,
      default: ""
    },
    cuisine: {
      type: String,
      default: "Any Cuisine"
    },
    diet: {
      type: String,
      default: "No Preference"
    },
    cookingTime: {
      type: String,
      default: "30 minutes"
    },
    difficulty: {
      type: String,
      default: "Easy"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);