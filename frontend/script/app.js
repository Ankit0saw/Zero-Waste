//For hamburger menu
const mainContent = document.getElementById("main-content");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const menuIcon = document.getElementById("menu-icon");

  let menuOpen = false;

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("hidden")
  menuOpen = !menuOpen;
  menuIcon.textContent = menuOpen ? "close" : "menu";

  // Toggle blur on the rest of the page
  if (menuOpen) {
    mainContent.classList.add("blur-[4px]", "brightness-50", "pointer-events-none");
  } else {
    mainContent.classList.remove("blur-[4px]", "brightness-50", "pointer-events-none");
  }
});


//Adding or Removing the ingredients instantly in current items list
const ingredients = document.getElementById('ingredients');
const addBtn = document.getElementById('add-btn');
const clrBtn = document.getElementById('clr-btn');
const itemContainer = document.getElementById('items-container');
const resultContainer = document.getElementById("recipe-result");

addBtn.addEventListener("click", () => {
    const input = ingredients.value.trim();
    console.log(input);
    const items = input.split(',').map(item => item.trim()).filter(item => item !== '');
    console.log(items);

    itemContainer.innerHTML = '';
    items.forEach(element => {
        const p = document.createElement('p');
        p.className ='text-slate-800 flex w-full items-center rounded-md p-3 transition-all hover:bg-green-300';
        p.textContent = element;
        itemContainer.appendChild(p);
    });
});

clrBtn.addEventListener("click", () =>{
  ingredients.value = '';
  itemContainer.innerHTML = '';
  resultContainer.innerHTML = '<img src="img/food-landing-img.png" alt="general suggestion image" class="mt-5 w-1/2 h-auto opacity-50 rounded-md mx-auto bg-green-100">';
});

//to show the generated recipes
document.getElementById("add-btn").addEventListener("click", async () => {
  const ingredients = document.getElementById("ingredients").value.trim();
  const resultContainer = document.getElementById("recipe-result");

  if (!ingredients) {
    resultContainer.innerHTML = `<p class="text-red-600">Please enter some ingredients...</p>`;
    return;
  }

  resultContainer.innerHTML = `<p class="text-green-600 p-2">Fetching recipes...</p>`;

  try {
    const res = await fetch("http://localhost:3000/get-recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });

    const data = await res.json();
    resultContainer.innerHTML = "";

    if (!data.success) {
      resultContainer.innerHTML = `<p class="text-red-600">Error: ${data.error}</p>`;
      return;
    }

    const recipesText = data.data;

    // Split into 3 blocks using title pattern
    const recipeBlocks = recipesText.split(/\*\*\d+\.\s(.+?)\*\*/).slice(1);

    // Group into title + block
    for (let i = 0; i < recipeBlocks.length; i += 2) {
      const title = recipeBlocks[i].trim();
      const details = recipeBlocks[i + 1];

      const cookTime = details.match(/\*\*Cooking Time:\*\*\s*(.+)/)?.[1] || "Time not found";
      const type = details.match(/\*\*Veg\/Non-Veg:\*\*\s*(.+)/)?.[1] || "Type not mentioned";
      const description = details.match(/\*\*Short Description:\*\*\s*(.+)/)?.[1] || "No description";

      const ingredientsMatch = details.match(/\*\*Ingredients:\*\*([\s\S]*?)\*\*Step/);
      const stepsMatch = details.match(/\*\*Step-by-step Instructions:\*\*([\s\S]*)/);

      const ingredientsList = ingredientsMatch ? ingredientsMatch[1].trim().split("\n").map(i => i.replace(/^\s*[-*]\s*/, "").trim()).filter(Boolean) : [];
      const stepsList = stepsMatch ? stepsMatch[1].trim().split("\n").map(s => s.replace(/^\d+\.\s*/, "").trim()).filter(Boolean) : [];

      const card = document.createElement("div");
      card.className = "w-full md:w-[300px] bg-green-200 hover:bg-green-300 text-gray-900 rounded-md shadow-lg p-4 mb-4 hover:scale-[1.02] transition-transform duration-300 border border-green-500";

      card.innerHTML = `
        <h3 class="text-xl font-bold mb-1 text-green-900">${title}</h3>
        <p class="text-sm text-gray-700 mb-1"><strong>Type:</strong> ${type}</p>
        <p class="text-sm text-gray-700 mb-1"><strong>Time:</strong> ${cookTime}</p>
        <p class="text-sm text-gray-600 mb-2">${description}</p>
        <button class="bg-green-700 text-white text-sm px-4 py-1 rounded hover:bg-green-800 transition" data-toggle>
          Read more
        </button>
        <div class="hidden mt-3 text-sm text-gray-800 space-y-2 p-3 rounded" data-content>
          <p><strong>Ingredients:</strong></p>
          <ul class="list-disc pl-4">${ingredientsList.map(i => `<li>${i}</li>`).join("")}</ul>
          <p class="mt-2"><strong>Steps:</strong></p>
          <ol class="list-decimal pl-4">${stepsList.map(s => `<li>${s}</li>`).join("")}</ol>
        </div>
      `;

      const toggleBtn = card.querySelector("[data-toggle]");
      const content = card.querySelector("[data-content]");

      toggleBtn.addEventListener("click", () => {
        content.classList.toggle("hidden");
        toggleBtn.textContent = content.classList.contains("hidden") ? "Read more" : "Hide";
      });

      resultContainer.appendChild(card);
    }

  } catch (error) {
    resultContainer.innerHTML = `<p class="text-red-600">Server Error: ${error.message}</p>`;
  }
});







// Spoonacular api

// const ingredients = document.getElementById('ingredients');
// const addBtn = document.getElementById('add-btn');
// const recipeResult = document.getElementById('recipe-result');
// const apiKey ="aa9c07025bde436980bb0fab77ac5449";

// addBtn.addEventListener("click", () =>{
//     const items = ingredients.value.trim();
//     fetchRecipes(items);
// })

// const fetchRecipes = async (items) => {
//     try {
//         const response = await fetch(
//             `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${items}&sort=popularity&number=10&apiKey=${apiKey}`);
            
//         const recipes = await response.json();

//         recipeResult.innerHTML = ""; // Clear previous results

//         recipes.results.forEach(recipe => {
//             const card = document.createElement("div");
//             card.className = "relative h-auto m-2.5 overflow-hidden text-white rounded-md bg-white shadow-md";

//             card.innerHTML = `
//                 <img src="${recipe.image}" alt="card-image"
//                     class="w-full h-48 object-cover rounded-t-md" />
//                 <div class="p-4 text-black">
//                     <h6 class="text-xl font-semibold mb-2">${recipe.title}</h6>
//                     <button class="read-more bg-slate-800 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-700 transition">
//                         Read More
//                     </button>
//                     <div class="recipe-details mt-3 hidden"></div>
//                 </div>
//             `;

//             const readMoreBtn = card.querySelector(".read-more");
//             const detailsDiv = card.querySelector(".recipe-details");

//             readMoreBtn.addEventListener("click", async () => {
//                 if (detailsDiv.innerHTML === "") {
//                     const info = await fetchRecipeDetails(recipe.id);
//                     detailsDiv.innerHTML = `
//                         <h4 class="font-semibold text-base mb-1 text-green-700">Ingredients:</h4>
//                         <ul class="list-disc list-inside text-sm text-gray-800">
//                             ${info.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join("")}
//                         </ul>
//                         <h4 class="font-semibold text-base mt-3 mb-1 text-green-700">Steps:</h4>
//                         <ol class="list-decimal list-inside text-sm text-gray-800">
//                             ${
//                                 info.analyzedInstructions[0]?.steps.map(step => `<li>${step.step}</li>`).join("") 
//                                 || "<li>No instructions found.</li>"
//                             }
//                         </ol>
//                     `;
//                     detailsDiv.classList.remove("hidden");
//                 } else {
//                     detailsDiv.classList.toggle("hidden");
//                 }
//             });

//             recipeResult.appendChild(card);
//         });

//     } catch (error) {
//         console.error("Error fetching recipes:", error);
//         recipeResult.innerHTML = `<p class="text-red-500">Failed to fetch recipes. Check your internet connection or API key.</p>`;
//     }
// };

// const fetchRecipeDetails = async (id) => {
//     const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${apiKey}`);
//     return await response.json();
// };
