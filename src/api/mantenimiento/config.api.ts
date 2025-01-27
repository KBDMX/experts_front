import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();
export const baseUrl = process.env.BASE_URL || 'https://experts-back.onrender.com/api/v1';
