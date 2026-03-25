import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_URL}/api/`,
  headers: { "Content-Type": "application/json" },
});

export const login = (email, password) =>
  api.post("/login/", { email, password });

export const register = (userData) => api.post("/register/", userData);

export const predictDisease = (imageBase64, location) =>
  api.post("/predict/", {
    image: imageBase64,
    latitude: location?.lat,
    longitude: location?.lng,
  });

export const getWeather = (lat, lng) =>
  api.post("/weather/", { latitude: lat, longitude: lng });

export const chatWithBot = (query, language) =>
  api.post("/chatbot/", { query, language });

export const reportInfection = (data) => api.post("/report-infection/", data);

export const getNearbyAlerts = (lat, lng) =>
  api.post("/nearby-alerts/", { latitude: lat, longitude: lng });

export default api;
