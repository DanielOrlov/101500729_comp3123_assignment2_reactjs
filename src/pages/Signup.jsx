import { useState } from "react";
import { UsersAPI } from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); // rename to avoid clash with form field

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await UsersAPI.addUser(signupForm);
      console.log("Adding new user", res.data);

      // backend returns { status, message, user, token }
      //const { user, token } = res.data;

      // save token in localStorage
      //localStorage.setItem("authToken", token);

      // save user in context
      //authLogin(user);

      // redirect to employee view
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add new user: ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">

          <div className="card shadow-sm p-4">
            <h1 className="text-center mb-4">Register</h1>

            {error && (
              <div className="alert alert-danger text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  className="form-control"
                  value={signupForm.username}
                  placeholder="Enter your username..."
                  onChange={(e) =>
                    setSignupForm((f) => ({ ...f, username: e.target.value }))
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  value={signupForm.email}
                  placeholder="Enter your email..."
                  onChange={(e) =>
                    setSignupForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Enter your password..."
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
              </div>

              <div className="d-flex flex-column gap-2 mt-3">
                <button type="submit" className="btn btn-primary">Sign Up</button>
                <Link to="/login" className="btn btn-secondary">Cancel</Link>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>

  );

}
