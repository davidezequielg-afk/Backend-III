import app from './app.js';
import { connectionDB } from './config/config.database.js';
import { config } from './config/env.config.js';
import logger from './config/logger.js';

const startServer = async () => {
  await connectionDB();
  app.listen(config.PORT, () => {
    logger.info(`Servidor ShipNow escuchando en el puerto ${config.PORT}`);
  });
};

startServer();