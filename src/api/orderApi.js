import axios from "axios";

const BASE_URL = "https://rj-solar-backend-production.up.railway.app/api/orders";

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getOrders = async () => {
  const response = await axios.get(BASE_URL, authHeader());
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await axios.post(
    BASE_URL,
    orderData,
    authHeader()
  );
  return response.data;
};

export const updateOrder = async (id, orderData) => {
  const response = await axios.put(
    `${BASE_URL}/${id}`,
    orderData,
    authHeader()
  );
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axios.delete(
    `${BASE_URL}/${id}`,
    authHeader()
  );
  return response.data;
};