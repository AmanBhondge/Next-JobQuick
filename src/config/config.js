import { config } from "dotenv";
import process from "process";

config();

export const {PORT, MONGODB_URI, JWT_SECRET, NODE_ENV, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env;