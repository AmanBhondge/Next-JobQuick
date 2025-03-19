import axios from "axios";
import { GEMINI_API_KEY } from "../config/config.js";

export const generate = async (req, res) => {
    try {
        const { category, subcategory } = req.body;

        if (!category || !subcategory) {
            return res.status(400).json({ error: "Category and subcategory are required." });
        }

        const prompt = `Generate 15 multiple-choice questions (MCQs) with 4 options each (1 correct and 3 incorrect).
        - 5 beginner-level questions
        - 5 intermediate-level questions
        - 5 advanced-level questions
        Each question should be based on:
        - Category: ${category}
        - Subcategory: ${subcategory}
         Format each question as:
        Q: [Question text]
        A) [Option 1]
        B) [Option 2]
        C) [Option 3]
        D) [Option 4]
        Correct: [A/B/C/D]
        ##`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            { headers: { "Content-Type": "application/json" } }
        );
        const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            return res.status(500).json({ error: "Failed to generate questions from API." });
        }

        const questions = generatedText.split("\n").filter(q => q.trim() !== "");

        res.json({ success: true, questions });

    } catch (error) {
        console.error("Error generating questions:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal server error. Please try again." });
    }
};