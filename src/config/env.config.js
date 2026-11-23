import dotenv from 'dotenv';

dotenv.config();

const REQUIRED = ['PORT', 'MONGODB_URI', 'NODE_ENV'];
const NODE_ENVS = ['development', 'test', 'production'];
const LOG_LEVELS = ['fatal', 'error', 'warning', 'info', 'http', 'debug'];

const { PORT, MONGODB_URI, NODE_ENV, UPLOADS_DIR, LOG_LEVEL, ENABLE_SWAGGER } = process.env;
const errors = [];

for (const name of REQUIRED) {
  if (!process.env[name]) errors.push(`${name} es obligatoria`);
}

if (NODE_ENV && !NODE_ENVS.includes(NODE_ENV)) {
  errors.push(`NODE_ENV debe ser uno de: ${NODE_ENVS.join(', ')} (recibido: ${NODE_ENV})`);
}

const port = Number(PORT);
if (PORT && (!Number.isInteger(port) || port < 1 || port > 65535)) {
  errors.push(`PORT debe ser un entero entre 1 y 65535 (recibido: ${PORT})`);
}

const logLevel = LOG_LEVEL || (NODE_ENV === 'production' ? 'info' : 'debug');
if (!LOG_LEVELS.includes(logLevel)) {
  errors.push(`LOG_LEVEL debe ser uno de: ${LOG_LEVELS.join(', ')} (recibido: ${logLevel})`);
}

if (ENABLE_SWAGGER && !['true', 'false'].includes(ENABLE_SWAGGER)) {
  errors.push(`ENABLE_SWAGGER debe ser true o false (recibido: ${ENABLE_SWAGGER})`);
}

if (errors.length > 0) {
  throw new Error(`Configuración de entorno inválida:\n - ${errors.join('\n - ')}`);
}

export const config = {
  PORT: port,
  MONGODB_URI,
  NODE_ENV,
  UPLOADS_DIR: UPLOADS_DIR || 'uploads',
  LOG_LEVEL: logLevel,
  ENABLE_SWAGGER: ENABLE_SWAGGER !== 'false'
};
