import dotenv from 'dotenv';

dotenv.config();

const REQUIRED = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

const faltantes = REQUIRED.filter((name) => !process.env[name]);
if (faltantes.length > 0) {
  throw new Error(`Faltan variables de entorno obligatorias: ${faltantes.join(', ')}`);
}

export const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,
};
