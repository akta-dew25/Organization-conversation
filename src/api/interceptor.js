import axios from "axios";
import { tokenService } from "../services/tokenService";

export const setupInterceptors = (api) => {
  // REQUEST INTERCEPTOR
  api.interceptors.request.use((config) => {
    const token = tokenService.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // RESPONSE INTERCEPTOR
  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = tokenService.getRefreshToken();

          // CALL AUTH SERVICE
          const { data } = await axios.post(
            "http://localhost:5000/api/v1/auth/refresh-token",
            {
              refreshToken,
            },
          );

          // UPDATE TOKEN
          const oldTokens = tokenService.getTokens();

          tokenService.setTokens(data.accessToken, oldTokens.refreshToken);

          // RETRY REQUEST
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          tokenService.clearTokens();

          window.location.href = "/login";

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
};
