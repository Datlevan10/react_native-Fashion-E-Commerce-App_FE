import axios from "axios";
import * as SecureStore from "expo-secure-store";
import API_BASE_URL from "../configs/config";

const API_URL = `${API_BASE_URL}/api/v1`;

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
                // Check for admin refresh token first, then customer refresh token
                let refreshToken = await SecureStore.getItemAsync(
                    "admin_refresh_token"
                );
                let isAdmin = true;
                if (!refreshToken) {
                    refreshToken = await SecureStore.getItemAsync(
                        "refresh_token"
                    );
                    isAdmin = false;
                }

                if (!refreshToken) {
                    throw new Error("No refresh token available.");
                }

                // Use appropriate endpoint based on user type
                const refreshEndpoint = isAdmin
                    ? `${API_URL}/admin/auth/refresh-token`
                    : `${API_URL}/customers/auth/refresh-token`;

                const { data } = await axios.post(
                    refreshEndpoint,
                    {
                        refresh_token: refreshToken,
                    },
                    { headers: { "Content-Type": "application/json" } }
                );

                const { access_token, expires_in } = data;
                const newExpiryTime = Date.now() + expires_in * 1000;

                // Store tokens with appropriate keys
                if (isAdmin) {
                    await SecureStore.setItemAsync(
                        "admin_access_token",
                        access_token
                    );
                    await SecureStore.setItemAsync(
                        "admin_token_expiry",
                        newExpiryTime.toString()
                    );
                } else {
                    await SecureStore.setItemAsync(
                        "access_token",
                        access_token
                    );
                    await SecureStore.setItemAsync(
                        "access_token_expiry",
                        newExpiryTime.toString()
                    );
                }

                api.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${access_token}`;
                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${access_token}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.log(
                    "Refresh token error:",
                    refreshError.response?.data
                );
                // Clear both admin and customer tokens
                await SecureStore.deleteItemAsync("access_token");
                await SecureStore.deleteItemAsync("refresh_token");
                await SecureStore.deleteItemAsync("admin_access_token");
                await SecureStore.deleteItemAsync("admin_refresh_token");
            }
        }

        return Promise.reject(error);
    }
);

api.interceptors.request.use(
    async (config) => {
        // Check for admin token first, then customer token
        let token = await SecureStore.getItemAsync("admin_access_token");
        if (!token) {
            token = await SecureStore.getItemAsync("access_token");
        }
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
