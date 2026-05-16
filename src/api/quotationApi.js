import axios from "axios";

const BASE_URL =
  "https://rj-solar-backend-production.up.railway.app/api/quotations";

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getQuotations = async () => {
  const response = await axios.get(BASE_URL, authHeader());
  return response.data;
};

export const createQuotation = async (quotationData) => {
  const response = await axios.post(BASE_URL, quotationData, authHeader());
  return response.data;
};

export const updateQuotation = async (id, quotationData) => {
  const response = await axios.put(
    `${BASE_URL}/${id}`,
    quotationData,
    authHeader()
  );
  return response.data;
};

export const deleteQuotation = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, authHeader());
  return response.data;
};