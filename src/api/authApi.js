import axios from "axios";
import { setupInterceptors } from "./interceptor";

const authApi = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

setupInterceptors(authApi);

export default authApi;
