import axios from "axios";

const BASE_URL = "https://rj-solar-backend-production.up.railway.app/api/suppliers";

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getSuppliers = async () => {
  const response = await axios.get(BASE_URL, authHeader());
  return response.data;
};

export const createSupplier = async (supplierData) => {
  const response = await axios.post(BASE_URL, supplierData, authHeader());
  return response.data;
};

export const updateSupplier = async (id, supplierData) => {
  const response = await axios.put(
    `${BASE_URL}/${id}`,
    supplierData,
    authHeader()
  );
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, authHeader());
  return response.data;
};