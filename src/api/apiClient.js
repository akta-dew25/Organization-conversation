import axios from "axios";
import tokenService from "../services/tokenService";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request interceptor to add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        if (refreshToken) {
          // Call refresh token endpoint (adjust based on your API)
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1"}/auth/refresh`,
            { refreshToken },
          );

          // Save new tokens
          if (data.accessToken) {
            tokenService.setTokens(
              data.accessToken,
              data.refreshToken || refreshToken,
            );
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            // Retry the original request
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        tokenService.clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
