import mongoose from 'mongoose';
import { config } from './env.config.js';

export const connectionDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Base de datos conectada correctamente');
  } catch (error) {
    console.error('Error de conexión con la base de datos:', error.message);
    process.exit(1);
  }
};