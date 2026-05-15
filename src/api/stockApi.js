import axios from "axios";

const BASE_URL = "https://rj-solar-backend-production.up.railway.app/api/stock";

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getStock = async () => {
  const response = await axios.get(BASE_URL, authHeader());
  return response.data;
};

export const createStockItem = async (stockData) => {
  const response = await axios.post(
    BASE_URL,
    stockData,
    authHeader()
  );
  return response.data;
};

export const updateStockItem = async (id, stockData) => {
  const response = await axios.put(
    `${BASE_URL}/${id}`,
    stockData,
    authHeader()
  );
  return response.data;
};

export const deleteStockItem = async (id) => {
  const response = await axios.delete(
    `${BASE_URL}/${id}`,
    authHeader()
  );
  return response.data;
};

export const createStockMovement = async (movementData) => {
  const response = await axios.post(
    `${BASE_URL}/movement`,
    movementData,
    authHeader()
  );
  return response.data;
};

export const getStockMovements = async () => {
  const response = await axios.get(
    `${BASE_URL}/movements`,
    authHeader()
  );
  return response.data;
};