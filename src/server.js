import mongoose from 'mongoose';
import { config } from './config/env.config.js';
import logger from './config/logger.js';

const startServer = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info(`La conexion a MongoDB se a establecido`);
  } catch (error) {
    logger.error(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

startServer();