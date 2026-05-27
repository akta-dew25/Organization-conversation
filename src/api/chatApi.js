import axios from "axios";

import {
  requestInterceptor,
  responseSuccessInterceptor,
  responseErrorInterceptor,
} from "./interceptor.js";

const chatApi = axios.create({
  baseURL: "http://localhost:8000/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

chatApi.interceptors.request.use(requestInterceptor);

chatApi.interceptors.response.use(
  responseSuccessInterceptor,
  responseErrorInterceptor,
);

export default chatApi;
