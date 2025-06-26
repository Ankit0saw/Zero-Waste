import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config(); // Loads .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Load Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// POST API for recipe generation
app.post("/get-recipes", async (req, res) => {
  const { ingredients } = req.body;

  const prompt = `Suggest 3 popular Indian recipes using the following ingredients: ${ingredients}.
                  Each recipe should include:
                  1. Title
                  2. Cooking Time
                  3. Veg or Non-Veg type
                  4. Short Description
                  5. Complete Ingredients
                  6. Step-by-step Instructions`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.send({ success: true, data: text });
  } catch (err) {
    console.error("❌ Error occurred:", err.message);
    res.send({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
