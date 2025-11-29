import './App.css';

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Employees from "./pages/Employees";
import EmployeeDetails from "./pages/EmployeeDetails";

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/:id" element={<EmployeeDetails />} />
        <Route path="*" element={<div>Default</div>} />
      </Routes>
    </>
  );
}

export default App;
