//For hamburger menu
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('nav-links');

toggle.addEventListener("click", () =>{
    menu.classList.toggle("hidden");
});


//Showing the ingredients instantly in current items list
const ingredients = document.getElementById('ingredients');
const addBtn = document.getElementById('add-btn');
const itemContainer = document.getElementById('items-container');

addBtn.addEventListener("click", () => {
    const input = ingredients.value.trim();
    console.log(input);
    const items = input.split(',').map(item => item.trim()).filter(item => item !== '');
    console.log(items);

    itemContainer.innerHTML = '';
    items.forEach(element => {
        const p = document.createElement('p');
        p.className ='text-slate-800 flex w-full items-center rounded-md p-3 transition-all hover:bg-slate-200';
        p.textContent = element;
        itemContainer.appendChild(p);
    });
});


//to show the generated recipes
document.getElementById("add-btn").addEventListener("click", async () => {
    const ingredients = document.getElementById("ingredients").value.trim();
    const container = document.getElementById("recipe-result");

    if (!ingredients) {
        container.innerHTML = `<p class="text-red-600">Please enter some ingredients.</p>`;
        return;
    }

    container.innerHTML = `<p class="text-gray-600 p-2">Fetching recipes...</p>`;

    try {
        const res = await fetch("http://localhost:3000/get-recipes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients }),
        });

        const data = await res.json();
        container.innerHTML = "";

        if (!data.success) {
            container.innerHTML = `<p class="text-red-600">Error: ${data.error}</p>`;
            return;
        }

        // Split Gemini response into recipe blocks
        const recipes = data.data.split(/\n\s*\n/).filter(Boolean);

        recipes.forEach((recipeBlock, i) => {
            try {
                const card = document.createElement("div");
                card.className = "bg-green-100 border rounded-lg p-4 mb-4 shadow";

                const lines = recipeBlock.split("\n");
                const title = lines[0]?.replace(/^\d+\.\s*/, "") || `Recipe ${i + 1}`;
                const cookTime = lines.find(l => l.toLowerCase().includes("cooking time")) || "";
                const vegStatus = lines.find(l => l.toLowerCase().includes("veg")) || "";
                const shortDesc = lines.find(l => l.toLowerCase().includes("description")) || "";

                const hiddenContent = document.createElement("div");
                hiddenContent.className = "mt-2 hidden whitespace-pre-wrap text-sm text-gray-800";
                hiddenContent.innerText = lines.slice(4).join("\n");

                const btn = document.createElement("button");
                btn.className = "mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded";
                btn.textContent = "Read more";
                btn.addEventListener("click", () => hiddenContent.classList.toggle("hidden"));

                card.innerHTML = `
                    <h3 class="text-lg font-bold text-green-900">${title}</h3>
                    <p class="text-sm text-gray-700">${cookTime}</p>
                    <p class="text-sm text-gray-600">${vegStatus}</p>
                    <p class="text-sm text-gray-700 mt-1">${shortDesc}</p>
                `;
                card.appendChild(btn);
                card.appendChild(hiddenContent);
                container.appendChild(card);
            } catch (parseError) {
                console.warn("Skipping invalid recipe block:", recipeBlock);
            }
        });
    } catch (error) {
        container.innerHTML = `<p class="text-red-600">Server Error: ${error.message}</p>`;
    }
});



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
