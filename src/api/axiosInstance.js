import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5052/api/v1/",
});

// Automatically attach JWT token
axiosInstance.interceptors.request.use((config) => {
  // read the token name used by the app (we store as `jwtToken`)
  const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
