import axios from "axios";
import { setupInterceptors } from "./interceptor";

const orgApi = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

setupInterceptors(orgApi);

export default orgApi;
