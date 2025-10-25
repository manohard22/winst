import axios from "axios";
import { getToken, setToken, removeToken, isTokenExpiringSoon } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      // Check if token is expiring soon and refresh it
      if (isTokenExpiringSoon()) {
        try {
          const refreshResponse = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const newToken = refreshResponse.data.data.token;
          setToken(newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          removeToken();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
