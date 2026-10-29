import app from './app.js';
import { connectionDB } from './config/config.database.js';
import { config } from './config/env.config.js';

const startServer = async () => {
  await connectionDB();
  app.listen(config.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${config.PORT}`);
  });
};

startServer();