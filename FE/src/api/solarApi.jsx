import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_SOLAR_API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_SOLAR_API_KEY}`,
  }
});

export default api;
