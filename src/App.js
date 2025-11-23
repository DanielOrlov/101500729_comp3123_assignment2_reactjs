import logo from './logo.svg';
import { useEffect, useState } from "react";
import './App.css';
import axios from 'axios'

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Employees from "./pages/Employees";

// const api = axios.create({
//   baseURL: `https://101500729-comp3123-assignment1.vercel.app/api`
// })

function App() {

  // const [health, setHealth] = useState(null);
  // const [employees, setEmployees] = useState([]);
  // const [error, setError] = useState(null);

  // // test #1: health check on mount
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await api.get("/health");
  //       setHealth(res.data);                  // expect: { ok: true }
  //     } catch (err) {
  //       setError(err.message);
  //       console.error("Health error:", err);
  //     }
  //   })();
  // }, []);

  // // test #2: fetch employees on click (so you can see CORS/404 clearly)
  // const loadEmployees = async () => {
  //   try {
  //     setError(null);
  //     const res = await api.get("/v1/employees");
  //     setEmployees(res.data?.data || []);    // your API returns { data: [...] }
  //     console.log("Employees:", res.data);
  //   } catch (err) {
  //     setError(err.response?.data?.message || err.message);
  //     console.error("Employees error:", err);
  //   }
  // };

  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 12, padding: 12 }}>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign up</Link>
        <Link to="/employees">Employees</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="*" element={<div>Default</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
