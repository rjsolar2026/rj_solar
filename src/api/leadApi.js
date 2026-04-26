import axios from "axios";

const BASE_URL = "http://localhost:5000/api/leads";

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getLeads = async () => {
  const response = await axios.get(BASE_URL, authHeader());
  return response.data;
};

export const createLead = async (leadData) => {
  const response = await axios.post(BASE_URL, leadData, authHeader());
  return response.data;
};

export const updateLead = async (id, leadData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, leadData, authHeader());
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, authHeader());
  return response.data;
};