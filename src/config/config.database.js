import mongoose from 'mongoose';
import { config } from './env.config.js';
import logger from './logger.js';

export const connectionDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('Base de datos conectada correctamente');
  } catch (error) {
    logger.fatal(`Error de conexión con la base de datos: ${error.message}`);
    process.exit(1);
  }
};