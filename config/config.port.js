import { config } from 'dotenv';

config();

export const PORT = () => {
  try {
    const port = process.env.PORT || 8080 ;
    return port;
  } catch (error) {
    console.error('Error al obtener el puerto:', error);
    process.exit(1);
  }
}