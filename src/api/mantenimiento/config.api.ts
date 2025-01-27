export const baseUrl =
    process.env.VERCEL_ENV === 'production'
        ? 'https://experts-back.onrender.com/api/v1' // URL de producción en Vercel
        : 'http://localhost:3001/api/v1'; // URL local en desarrollo
