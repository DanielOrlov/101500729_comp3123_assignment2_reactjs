import './App.css';

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Employees from "./pages/Employees";

function App() {

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
