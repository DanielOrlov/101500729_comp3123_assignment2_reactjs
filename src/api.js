import axios from "axios";

export const api = axios.create({
  baseURL: "https://101500729-comp3123-assignment1.vercel.app/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // uncomment if you later use cookies
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
};

export const UsersAPI = {
  getAllUsers: (params) => api.get("/v1/users", { params }),
  addUser: (payload) => api.post("/v1/users", payload),
  login: (payload) => api.post("/v1/users/login", payload),
};
