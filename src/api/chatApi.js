import axios from "axios";
import { setupInterceptors } from "./interceptor";

const chatApi = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

setupInterceptors(chatApi);

export default chatApi;
