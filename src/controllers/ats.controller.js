import { GEMINI_API_KEY } from "../config/config.js";
import { PDFExtract } from "pdf.js-extract";
import axios from "axios";

const pdfExtract = new PDFExtract();

export const checkResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("File received:", req.file.originalname);
        console.log("File buffer:", req.file?.buffer ? "Buffer exists" : "No buffer");

        const options = {};
        const data = await pdfExtract.extractBuffer(req.file.buffer, options).catch(err => {
            console.error("PDF parsing error:", err);
            throw new Error("Failed to parse PDF");
        });

        const resumeText = data.pages.map(page =>
            page.content.map(item => item.str).join(' ')
        ).join('\n');

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `Analyze this resume for ATS compatibility. Provide a score out of 100 and suggest improvements. Format response as: \"Score: [number]\" followed by feedback.
\n${resumeText}`,
                            },
                        ],
                    },
                ],
            },
            { headers: { "Content-Type": "application/json" } }
        );

        let analysis = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No feedback received from AI";

        const scoreMatch = analysis.match(/Score:\s*(\d+)/);
        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

        if (score === null) {
            return res.status(500).json({ error: "Failed to extract score from AI response" });
        }

        res.json({ score, feedback: analysis });

    } catch (error) {
        console.error("Error analyzing resume:", error);
        if (error.message === "Only PDF files are allowed") {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: error.message || "Internal server error" });
    }
};