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

  const prompt = `Generate exactly 5 popular Indian recipes using mostly these ingredients: ${ingredients}.
                  Return a valid JSON array with exactly this structure for each recipe:

                  [
                    {
                      "Title": "Recipe Name",
                      "Cooking Time": "X minutes", 
                      "Veg or Non-Veg": "Veg" or "Non-Veg",
                      "Short Description": "Brief description of the dish",
                      "Ingredients": [
                        "ingredient 1 with quantity",
                        "ingredient 2 with quantity"
                      ],
                      "Step-by-step Instructions": [
                        "Step 1 description",
                        "Step 2 description"
                      ]
                    }
                  ]

                  Important:
                  - Use exactly these property names with correct capitalization and spacing
                  - Ingredients array should contain strings with quantities
                  - Instructions array should contain clear step-by-step directions
                  - Return only valid JSON, no additional text
                  - Each recipe should be complete and cookable`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });
    const response = await result.response;
    const jsonText = await response.text();
    //console.log("Raw API Response:", jsonText);

    const data = JSON.parse(jsonText);
    //console.log("Parsed JSON Data:", data);

    res.send({ success: true, data: data });
  } catch (err) {
    console.error("❌ Error occurred:", err.message);
    res.send({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
