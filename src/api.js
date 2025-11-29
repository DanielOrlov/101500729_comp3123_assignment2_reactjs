import axios from "axios";
export const API_ROOT = "https://101500729-comp3123-assignment1.vercel.app";

export const api = axios.create({
  baseURL: `${API_ROOT}/api`,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Employees API helpers
export const EmployeesAPI = {
  getAllEmployees: (params) => api.get("/v1/employees", { params }),
  getEmployeeById: (id) => api.get(`/v1/employees/${id}`),
  search: (q) => api.get("/v1/employees/search", { params: { q } }),
  addEmployee: (payload) => api.post("/v1/employees", payload),
  updateEmployee: (id, payload) => api.put(`/v1/employees/${id}`, payload),
  patchDepartment: (id, department) => api.patch(`/v1/employees/${id}`, { department }),
  deleteEmployee: (id) => api.delete(`/v1/employees/${id}`),
  uploadAvatar: (id, formData) => api.post(`/v1/employees/${id}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const UsersAPI = {
  getAllUsers: (params) => api.get("/v1/users", { params }),
  addUser: (payload) => api.post("/v1/users", payload),
  login: (payload) => api.post("/v1/users/login", payload),
};
