import axios from "axios";

const BASE_URL = "http://localhost:5000/api/users";

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getUsers = async () => {
  const response = await axios.get(BASE_URL, authHeader());
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(BASE_URL, userData, authHeader());
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, userData, authHeader());
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, authHeader());
  return response.data;
};