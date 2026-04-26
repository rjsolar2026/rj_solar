import axios from "axios";

const BASE_URL = "http://localhost:5000/api/auth";

export const signupUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/signup`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/login`, userData);
  return response.data;
};