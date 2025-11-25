import axios from "axios";

export const api = axios.create({
  baseURL: "https://101500729-comp3123-assignment1.vercel.app/api",
  headers: { "Content-Type": "application/json" },
  // withCredentials: true, // uncomment if you later use cookies
});

// Employees API helpers
export const EmployeesAPI = {
  list: (params) => api.get("/v1/employees", { params }),
  search: (q) => api.get("/v1/employees/search", { params: { q } }),
  create: (payload) => api.post("/v1/employees", payload),
  update: (id, payload) => api.put(`/v1/employees/${id}`, payload),
  patchDepartment: (id, department) =>
    api.patch(`/v1/employees/${id}`, { department }),
  remove: (id) => api.delete(`/v1/employees/${id}`),
};
