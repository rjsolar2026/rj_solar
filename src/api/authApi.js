import axios from "axios";

const BASE_URL = "https://rj-solar-backend-production.up.railway.app/api/auth";

export const signupUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/signup`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/login`, userData);
  return response.data;
};