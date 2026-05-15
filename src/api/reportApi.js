import axios from "axios";

const BASE_URL = "http://localhost:5000/api/reports";

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const uploadHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "multipart/form-data",
  },
});

export const getReports = async () => {
  const response = await axios.get(BASE_URL, authHeader());
  return response.data;
};

export const createReport = async (formData) => {
  const response = await axios.post(BASE_URL, formData, uploadHeader());
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, authHeader());
  return response.data;
};