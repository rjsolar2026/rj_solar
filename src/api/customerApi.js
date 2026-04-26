import axios from "axios";

const BASE_URL = "http://localhost:5000/api/customers";

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getCustomers = async () => {
  const response = await axios.get(BASE_URL, authHeader());
  return response.data;
};

export const createCustomer = async (customerData) => {
  const response = await axios.post(BASE_URL, customerData, authHeader());
  return response.data;
};

export const updateCustomer = async (id, customerData) => {
  const response = await axios.put(
    `${BASE_URL}/${id}`,
    customerData,
    authHeader()
  );
  return response.data;
};

export const deleteCustomer = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, authHeader());
  return response.data;
};