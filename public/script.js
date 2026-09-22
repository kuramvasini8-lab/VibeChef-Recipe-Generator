console.log("VIBECHEF SCRIPT LOADED");

const form = document.getElementById("recipeForm");
const ingredientsInput = document.getElementById("ingredients");
const cuisineInput = document.getElementById("cuisine");
const dietInput = document.getElementById("diet");
const cookingTimeInput = document.getElementById("cookingTime");
const difficultyInput = document.getElementById("difficulty");

const recipeOutput = document.getElementById("recipeOutput");

const generateBtn = document.getElementById("generateBtn");
const surpriseBtn = document.getElementById("surpriseBtn");

const copyBtn = document.getElementById("copyBtn");
const saveBtn = document.getElementById("saveBtn");

const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const historyList = document.getElementById("historyList");
const status = document.getElementById("status");

const customButtons = document.querySelectorAll(".custom-btn");

let currentRecipe = "";
let currentRecipeId = null;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  await generateRecipe({
    ingredients: ingredientsInput.value.trim(),
    cuisine: cuisineInput.value,
    diet: dietInput.value,
    cookingTime: cookingTimeInput.value,
    difficulty: difficultyInput.value
  });
});

surpriseBtn.addEventListener("click", async () => {
  ingredientsInput.value =
    "seasonal vegetables, rice, garlic, onion, herbs";

  cuisineInput.value = "Any Cuisine";
  dietInput.value = "No Preference";
  cookingTimeInput.value = "30 minutes";
  difficultyInput.value = "Easy";

  await generateRecipe({
    ingredients: ingredientsInput.value,
    cuisine: cuisineInput.value,
    diet: dietInput.value,
    cookingTime: cookingTimeInput.value,
    difficulty: difficultyInput.value
  });
});

copyBtn.addEventListener("click", async () => {
  if (!currentRecipe) return;

  try {
    await navigator.clipboard.writeText(currentRecipe);

    copyBtn.textContent = "✓ Copied";

    setTimeout(() => {
      copyBtn.textContent = "📋 Copy";
    }, 2000);
  } catch (error) {
    console.error(error);
    status.textContent = "Unable to copy recipe.";
  }
});

saveBtn.addEventListener("click", async () => {
  if (!currentRecipe) {
    status.textContent = "Generate a recipe first.";
    return;
  }

  await saveRecipe();
});

clearHistoryBtn.addEventListener("click", async () => {
  await clearAllRecipes();
});

customButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    await customizeRecipe(
      button.dataset.modification
    );
  });
});

async function generateRecipe(data) {
  if (!data.ingredients) {
    recipeOutput.textContent =
      "Please enter at least one ingredient.";

    status.textContent =
      "Missing ingredients";

    return;
  }

  generateBtn.disabled = true;
  surpriseBtn.disabled = true;
  copyBtn.disabled = true;
  saveBtn.disabled = true;

  customButtons.forEach((button) => {
    button.disabled = true;
  });

  generateBtn.textContent = "Creating...";
  status.textContent = "AI is cooking...";

  recipeOutput.textContent = "";
  currentRecipe = "";
  currentRecipeId = null;

  try {
    const response = await fetch(
      "/api/generate-recipe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      let errorMessage = "Something went wrong.";

      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (error) {}

      throw new Error(errorMessage);
    }

    if (!response.body) {
      throw new Error(
        "No response received from AI."
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const {
        value,
        done
      } = await reader.read();

      if (done) break;

      const text = decoder.decode(
        value,
        {
          stream: true
        }
      );

      currentRecipe += text;
      recipeOutput.textContent = currentRecipe;
    }

    status.textContent = "Recipe ready! 🍽️";

    copyBtn.disabled = false;
    saveBtn.disabled = false;

    customButtons.forEach((button) => {
      button.disabled = false;
    });
  } catch (error) {
    console.error(
      "Generation error:",
      error
    );

    recipeOutput.textContent =
      error.message;

    status.textContent =
      "Generation failed";
  } finally {
    generateBtn.disabled = false;
    surpriseBtn.disabled = false;
    generateBtn.textContent =
      "🍳 Create My Recipe";
  }
}

async function customizeRecipe(modification) {
  if (!currentRecipe) {
    status.textContent =
      "Generate a recipe first.";

    return;
  }

  customButtons.forEach((button) => {
    button.disabled = true;
  });

  copyBtn.disabled = true;
  saveBtn.disabled = true;

  status.textContent =
    "AI is customizing your recipe...";

  recipeOutput.textContent = "";

  try {
    const response = await fetch(
      "/api/customize-recipe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recipe: currentRecipe,
          modification
        })
      }
    );

    if (!response.ok) {
      let errorMessage =
        "Unable to customize recipe.";

      try {
        const error =
          await response.json();

        errorMessage =
          error.error ||
          errorMessage;
      } catch (error) {}

      throw new Error(errorMessage);
    }

    const reader =
      response.body.getReader();

    const decoder =
      new TextDecoder();

    let updatedRecipe = "";

    while (true) {
      const {
        value,
        done
      } = await reader.read();

      if (done) break;

      const text =
        decoder.decode(
          value,
          {
            stream: true
          }
        );

      updatedRecipe += text;

      recipeOutput.textContent =
        updatedRecipe;
    }

    currentRecipe =
      updatedRecipe;

    currentRecipeId = null;

    status.textContent =
      "Recipe updated! ✨";

    copyBtn.disabled = false;
    saveBtn.disabled = false;
  } catch (error) {
    console.error(
      "Customization error:",
      error
    );

    recipeOutput.textContent =
      error.message;

    status.textContent =
      "Customization failed";
  } finally {
    customButtons.forEach((button) => {
      button.disabled = false;
    });
  }
}

async function saveRecipe() {
  try {
    saveBtn.disabled = true;

    status.textContent =
      "Saving recipe...";

    const recipeData = {
      title: extractTitle(currentRecipe),
      content: currentRecipe,
      ingredients:
        ingredientsInput.value.trim(),
      cuisine:
        cuisineInput.value,
      diet:
        dietInput.value,
      cookingTime:
        cookingTimeInput.value,
      difficulty:
        difficultyInput.value
    };

    const response = await fetch(
      "/api/recipes",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body:
          JSON.stringify(recipeData)
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to save recipe."
      );
    }

    currentRecipeId =
      data.recipe._id;

    status.textContent =
      "Recipe saved successfully! 💾";

    saveBtn.textContent =
      "✓ Saved";

    await loadRecipes();

    setTimeout(() => {
      saveBtn.textContent =
        "💾 Save";
    }, 2000);
  } catch (error) {
    console.error(
      "Save error:",
      error
    );

    status.textContent =
      error.message;
  } finally {
    saveBtn.disabled = false;
  }
}

async function loadRecipes() {
  try {
    const response =
      await fetch("/api/recipes");

    if (!response.ok) {
      throw new Error(
        "Unable to load saved recipes."
      );
    }

    const recipes =
      await response.json();

    renderHistory(recipes);
  } catch (error) {
    console.error(
      "Load recipes error:",
      error
    );

    historyList.innerHTML =
      `<p class="no-history">
        Unable to load saved recipes.
      </p>`;
  }
}

function renderHistory(recipes) {
  if (
    !recipes ||
    recipes.length === 0
  ) {
    historyList.innerHTML =
      '<p class="no-history">No saved recipes yet.</p>';

    return;
  }

  historyList.innerHTML =
    recipes
      .map(
        (recipe) => `
          <div
            class="history-item"
            data-id="${recipe._id}"
          >
            <div class="history-info">
              <strong>
                ${escapeHtml(recipe.title)}
              </strong>

              <span>
                ${formatDate(recipe.createdAt)}
              </span>
            </div>

            <button
              class="delete-recipe-btn"
              data-id="${recipe._id}"
              type="button"
            >
              🗑️
            </button>
          </div>
        `
      )
      .join("");

  document
    .querySelectorAll(".history-item")
    .forEach((item) => {
      item.addEventListener(
        "click",
        (event) => {
          if (
            event.target.closest(
              ".delete-recipe-btn"
            )
          ) {
            return;
          }

          loadRecipe(
            item.dataset.id
          );
        }
      );
    });

  document
    .querySelectorAll(
      ".delete-recipe-btn"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        async (event) => {
          event.stopPropagation();

          await deleteRecipe(
            button.dataset.id
          );
        }
      );
    });
}

async function loadRecipe(id) {
  try {
    status.textContent =
      "Loading saved recipe...";

    const response =
      await fetch(
        `/api/recipes/${id}`
      );

    const recipe =
      await response.json();

    if (!response.ok) {
      throw new Error(
        recipe.error ||
        "Unable to load recipe."
      );
    }

    currentRecipe =
      recipe.content;

    currentRecipeId =
      recipe._id;

    recipeOutput.textContent =
      recipe.content;

    ingredientsInput.value =
      recipe.ingredients || "";

    cuisineInput.value =
      recipe.cuisine ||
      "Any Cuisine";

    dietInput.value =
      recipe.diet ||
      "No Preference";

    cookingTimeInput.value =
      recipe.cookingTime ||
      "30 minutes";

    difficultyInput.value =
      recipe.difficulty ||
      "Easy";

    status.textContent =
      "Saved recipe loaded";

    copyBtn.disabled = false;
    saveBtn.disabled = false;

    customButtons.forEach(
      (button) => {
        button.disabled = false;
      }
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } catch (error) {
    console.error(
      "Load recipe error:",
      error
    );

    status.textContent =
      error.message;
  }
}

async function deleteRecipe(id) {
  const confirmed =
    confirm(
      "Delete this saved recipe?"
    );

  if (!confirmed) {
    return;
  }

  try {
    const response =
      await fetch(
        `/api/recipes/${id}`,
        {
          method: "DELETE"
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to delete recipe."
      );
    }

    if (
      currentRecipeId === id
    ) {
      currentRecipeId = null;
    }

    status.textContent =
      "Recipe deleted.";

    await loadRecipes();
  } catch (error) {
    console.error(
      "Delete recipe error:",
      error
    );

    status.textContent =
      error.message;
  }
}

async function clearAllRecipes() {
  try {
    const response =
      await fetch(
        "/api/recipes"
      );

    const recipes =
      await response.json();

    if (!response.ok) {
      throw new Error(
        "Unable to load recipes."
      );
    }

    if (!recipes.length) {
      status.textContent =
        "No saved recipes to clear.";

      return;
    }

    const confirmed =
      confirm(
        "Delete all saved recipes?"
      );

    if (!confirmed) {
      return;
    }

    clearHistoryBtn.disabled =
      true;

    status.textContent =
      "Clearing saved recipes...";

    const deleteResponse =
      await fetch(
        "/api/recipes",
        {
          method: "DELETE"
        }
      );

    const data =
      await deleteResponse.json();

    if (!deleteResponse.ok) {
      throw new Error(
        data.error ||
        "Unable to clear recipes."
      );
    }

    currentRecipeId = null;

    status.textContent =
      "All saved recipes cleared.";

    await loadRecipes();
  } catch (error) {
    console.error(
      "Clear recipes error:",
      error
    );

    status.textContent =
      error.message;
  } finally {
    clearHistoryBtn.disabled =
      false;
  }
}

function extractTitle(recipe) {
  const match =
    recipe.match(
      /RECIPE TITLE:\s*(.*)/i
    );

  return match
    ? match[1].trim()
    : "Saved Recipe";
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Date(date)
    .toLocaleDateString();
}

function escapeHtml(text) {
  const div =
    document.createElement("div");

  div.textContent =
    text || "";

  return div.innerHTML;
}

loadRecipes();