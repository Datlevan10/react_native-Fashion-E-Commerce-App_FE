import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Cần thay đổi và sử dụng IP cục bộ của máy tính trong mạng nội bộ cho address API
const API_BASE_URL = "http://192.168.1.4:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
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

        const { data } = await axios.post(
          `${API_BASE_URL}/customers/auth/refresh-token`,
          {
            refresh_token: refreshToken,
          }
        );

        const { access_token, expires_in } = data;
        const newExpiryTime = Date.now() + expires_in * 1000;

        await SecureStore.setItemAsync("access_token", access_token);
        await SecureStore.setItemAsync(
          "access_token_expiry",
          newExpiryTime.toString()
        );

        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
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
