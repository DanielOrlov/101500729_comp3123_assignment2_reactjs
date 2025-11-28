import { useState } from "react";
import { UsersAPI } from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  const [loginForm, setLoginForm] = useState({
    login: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); // rename to avoid clash with form field

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await UsersAPI.login(loginForm);
      console.log("Logged in:", res.data);

      // backend returns { status, message, user, token }
      const { user, token } = res.data;

      // save token in localStorage
      localStorage.setItem("authToken", token);

      // save user in context
      authLogin(user);

      // redirect to employee view
      navigate("/employees");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="card-body">
          <h1 className="text-center my-4">Login</h1>
          <div className="d-flex align-items-center mb-3">

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

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
        </div>
      </div>
    </div>
  );

}
