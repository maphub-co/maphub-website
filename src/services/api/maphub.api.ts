import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MAPHUB_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-API-Source": "website",
  },
});

// Add auth token to requests automatically
api.interceptors.request.use(
  async (config) => {
    try {
      // Only try to get the auth token if we're in a browser environment
      if (typeof window !== "undefined") {
        const { user } = useAuthStore.getState();

        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    } catch (error) {
      console.error("Error adding token to request:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Handle errors consistently
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API error response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API error request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API error:", error.message);
    }

    // Return a more structured error for better handling
    return Promise.reject({
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });
  }
);
