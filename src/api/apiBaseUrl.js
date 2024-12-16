import axios from "axios";

export const baseURL = "http://localhost:3002/api";

export const apiService = axios.create({
  baseURL,
});

export const apiService2 = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});
