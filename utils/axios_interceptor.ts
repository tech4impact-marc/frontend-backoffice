import axios, { AxiosError, AxiosInstance } from "axios";

import { store } from "@/redux/store";

const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_IP_ADDRESS,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    const token = store.getState().tokens?.accessToken;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      config.withCredentials = true;
    }
    console.log(store.getState());
    return config;
  },
  (error: AxiosError | Error): Promise<AxiosError> => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default instance;
