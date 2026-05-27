import tokenService from "../services/tokenService";

export const requestInterceptor = (config) => {
  const token = tokenService.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const responseSuccessInterceptor = (response) => {
  return response;
};

export const responseErrorInterceptor = async (error) => {
  return Promise.reject(error);
};
