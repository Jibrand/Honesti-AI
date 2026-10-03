export const API_URL = import.meta.env.MODE === 'development' ? `http://${window.location.hostname}:3001/api` : 'https://honesti-ai.vercel.app/api';
