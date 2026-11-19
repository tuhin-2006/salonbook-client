import axios from "axios";

// Determine the API Base URL with dynamic fallback for Vercel production
export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    // If running in browser on production domain (e.g. *.vercel.app)
    if (
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      return "https://salonbook-server-omega.vercel.app/api/v1";
    }
  }
  return "http://localhost:5000/api/v1";
};

export const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Ensure baseURL matches environment dynamically on the client
  if (!config.baseURL || config.baseURL === "http://localhost:5000/api/v1") {
    config.baseURL = getApiBaseUrl();
  }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("salonbook_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);
