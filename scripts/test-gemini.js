// Quick test script for Gemini API
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function testModel(modelName) {
    console.log(`\nTesting model: ${modelName}`);
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent("Say hello in one word");
        console.log(`  ✅ Success:`, result.response.text().substring(0, 50));
        return true;
    } catch (error) {
        console.log(`  ❌ Failed:`, error.message.substring(0, 100));
        return false;
    }
}

async function test() {
    console.log("API Key length:", process.env.GEMINI_API_KEY?.length || 0);
    console.log("API Key prefix:", process.env.GEMINI_API_KEY?.substring(0, 10) + "...");

    // Try different model names
    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-002",
        "gemini-pro",
        "gemini-1.0-pro",
        "models/gemini-1.5-flash"
    ];

    for (const model of models) {
        const success = await testModel(model);
        if (success) break;
    }
}

test();
