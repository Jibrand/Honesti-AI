export const API_URL = import.meta.env.PROD 
  ? 'https://honesti-ai.vercel.app/api'
  : `http://${window.location.hostname}:3001/api`;
