import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();
export const baseUrl = process.env.BASE_URL || 'http://localhost:3001/api/v1';
