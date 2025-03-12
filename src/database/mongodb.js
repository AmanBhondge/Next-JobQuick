import mongoose from "mongoose";
import process from "process";

import { MONGODB_URI, NODE_ENV } from "../config/config.js";

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.<development/production>.local");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`Connected to database in ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to database', error);
        process.exit(1);
    }
}

export default connectToDatabase;