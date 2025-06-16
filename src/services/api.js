import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
  getTechnologies: () => api.get("/auth/technologies"),
};

// Student API
export const studentAPI = {
  getTasks: () => api.get("/tasks"),
  submitTask: (taskId, formData) => {
    return api.post(`/tasks/${taskId}/submit`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getPayments: () => api.get("/payments/my-payments"),
  getCertificates: (studentId) => api.get(`/certificates/student/${studentId}`),
};

// Payment API
export const paymentAPI = {
  processPayment: (paymentData) => api.post("/payments", paymentData),
  getPaymentHistory: () => api.get("/payments/my-payments"),
};

// Admin API
export const adminAPI = {
  getStudents: () => api.get("/admin/students"),
  getPayments: () => api.get("/admin/payments"),
  getTasks: () => api.get("/admin/tasks"),
  createTask: (taskData) => api.post("/admin/tasks", taskData),
  getDashboardStats: () => api.get("/admin/dashboard-stats"),
  generateCertificate: (data) => api.post("/certificates/generate", data),
};

// Certificate API
export const certificateAPI = {
  generate: (studentId, techId) =>
    api.post("/certificates/generate", { studentId, techId }),
  getStudentCertificates: (studentId) =>
    api.get(`/certificates/student/${studentId}`),
  downloadCertificate: (filename) => {
    return api.get(`/certificates/download/${filename}`, {
      responseType: "blob",
    });
  },
};

export default api;
