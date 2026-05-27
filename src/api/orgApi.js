import axios from "axios";

import {
  requestInterceptor,
  responseSuccessInterceptor,
  responseErrorInterceptor,
} from "./interceptor.js";

const orgApi = axios.create({
  baseURL: "http://localhost:5000/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

orgApi.interceptors.request.use(requestInterceptor);

orgApi.interceptors.response.use(
  responseSuccessInterceptor,
  responseErrorInterceptor,
);

export default orgApi;
