import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import { config } from "../src/config/env.config.js";

export const api = request(app);

export const connectTestDB = async () => {
    if (!config.MONGODB_URI.includes("test")) {
        throw new Error("Los tests deben ejecutarse en una base de datos de prueba");
    }
    await mongoose.connect(config.MONGODB_URI);
};

export const clearDB = async () => {
    await mongoose.connection.db.dropDatabase();
};

export const disconnectDB = async () => {
    await mongoose.disconnect();
};