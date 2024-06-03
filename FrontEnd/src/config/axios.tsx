import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

export const fetcher = (url: string) => apiClient.get(url).then((res) => res.data);
