import axios from "axios";
import * as SecureStore from "expo-secure-store";
import API_BASE_URL from "../configs/config";

const API_URL = `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Error details:", error.response?.data);
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available.");
        }

        // console.log("Attempting to refresh token...");
        // console.log("Original request URL:", originalRequest.url);
        // console.log("Refresh token sent:", refreshToken);

        const { data } = await axios.post(
          `${API_URL}/customers/auth/refresh-token`,
          {
            refresh_token: refreshToken,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const { access_token, expires_in } = data;
        const newExpiryTime = Date.now() + expires_in * 1000;

        // console.log("New access token received:", access_token);
        // console.log("New expiry time:", new Date(newExpiryTime).toLocaleString());

        await SecureStore.setItemAsync("access_token", access_token);
        await SecureStore.setItemAsync(
          "access_token_expiry",
          newExpiryTime.toString()
        );

        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token error:", refreshError.response?.data);
        await SecureStore.deleteItemAsync("access_token");
        await SecureStore.deleteItemAsync("refresh_token");
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
