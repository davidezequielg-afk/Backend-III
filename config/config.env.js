import dotenv from "dotenv";

dotenv.config();

export const MONGO_URL = process.env.MONGODB_URI
export const JWT_SECRET = process.env.JWT_SECRET;
export const { NODE_ENV } = process.env;