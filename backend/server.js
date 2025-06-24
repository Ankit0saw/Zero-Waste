require("dotenv").config(); // Load .env variables

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files (if needed)
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Load API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// POST endpoint to get recipes
app.post("/get-recipes", async (req, res) => {
  const { ingredients } = req.body;
  const prompt = `Suggest 3 easy, popular Indian recipes using the following ingredients: ${ingredients}.
Each recipe should include:
1. Title
2. Cooking Time
3. Veg or Non-Veg
4. Short Description
5. Ingredients
6. Step-by-step Instructions`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.send({ success: true, data: text });
  } catch (err) {
  console.error("❌ Error occurred:", err.message);
  res.send({ success: false, error: err.message });
}
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
