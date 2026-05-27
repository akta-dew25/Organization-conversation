import axios from "axios";

import {
  requestInterceptor,
  responseSuccessInterceptor,
  responseErrorInterceptor,
} from "./interceptor.js";

const authApi = axios.create({
  baseURL: "http://localhost:3000/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use(requestInterceptor);

authApi.interceptors.response.use(
  responseSuccessInterceptor,
  responseErrorInterceptor,
);

export default authApi;
