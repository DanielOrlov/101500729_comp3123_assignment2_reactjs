import { useEffect, useState } from "react";
import { UsersAPI } from "../api";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Modal from "../components/Modal";

export default function Login() {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  const [loginForm, setLoginForm] = useState({
    login: "",
    password: "",
  });

  return (
    <div className="container mt-4">
      <h1 className="text-center my-4">Login</h1>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await UsersAPI.login(loginForm);
            console.log("Logged in:", res.data);


            //navigate("/employees");
          } catch (err) {
            setError(err.response?.data?.message || err.message);
          }
        }}>

        <div className="mb-3">
          <label className="form-label">Username/Email</label>
          <input
            className="form-control"
            value={loginForm.login}
            placeholder="Enter username or login..."
            onChange={(e) =>
              setLoginForm((f) => ({ ...f, login: e.target.value }))
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            placeholder="Enter your password..."
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm((f) => ({ ...f, password: e.target.value }))
            }
          />
        </div>
        <button type="submit" className="btn btn-success my-2 mx-2">Login</button>
        <Link to="/signup" className="btn btn-primary my-2 mx-2">Sign Up</Link>
      </form>
    </div>
  );

}
