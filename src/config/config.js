import { config } from "dotenv";
import process from "process";

config();

export const { PORT, MONGODB_URI, JWT_SECRET, NODE_ENV, GEMINI_API_KEY } = process.env;