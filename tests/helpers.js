import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import { config } from "../src/config/env.config.js";
import fs from 'fs';
import path from 'path';

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

export const disconnectTestDB = async () => {
    await mongoose.disconnect();
};

const UPLOAD_FOLDERS = ['documents', 'receipts'];

export const clearUploads = () => {
    const root = path.resolve(config.UPLOADS_DIR);
    if (!root.includes('test')) {
        throw new Error('Los tests solo pueden limpiar una carpeta de uploads de test');
    }
    for (const folder of UPLOAD_FOLDERS) {
        const dir = path.join(root, folder);
        if (!fs.existsSync(dir)) continue;
        for (const file of fs.readdirSync(dir)) {
            fs.rmSync(path.join(dir, file), { force: true });
        }
    }
};

export const countUploads = (folder) => {
    const dir = path.resolve(config.UPLOADS_DIR, folder);
    return fs.existsSync(dir) ? fs.readdirSync(dir).length : 0;
};
