import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

config();

const apiKey = process.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    console.log("--- Testing Model Availability ---");

    // 1. Try to list models via REST API (most reliable way to see what's enabled)
    try {
        console.log("Fetching available models via REST API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            console.error(`REST API Error: ${response.status} ${response.statusText}`);
            const errorBody = await response.text();
            console.error("Error body:", errorBody);
        } else {
            const data = await response.json();
            if (data.models) {
                console.log("Available Models:");
                data.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                        console.log(` - ${m.name} (${m.displayName})`);
                    }
                });
            } else {
                console.log("No models found in response:", data);
            }
        }
    } catch (e) {
        console.error("Failed to fetch models:", e);
    }

    // 2. Try a generation with gemini-1.5-flash
    try {
        console.log("\nAttempting generation with 'gemini-1.5-flash'...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say hello");
        console.log("Success! Response:", result.response.text());
    } catch (e) {
        console.error("Failed with gemini-1.5-flash:", e.message);
    }
}

test();
