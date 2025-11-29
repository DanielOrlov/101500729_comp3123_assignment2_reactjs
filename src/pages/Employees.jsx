import { useEffect, useState } from "react";
import { EmployeesAPI } from "../api";
import { Link, useNavigate } from "react-router-dom";
import { formatSalary, validateCreate } from "../util/format";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

export default function Employees() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    salary: "",
  });

  const handleLogout = () => {
    logout();            // clears user + token
    navigate("/login");  // go back to login page
  };


  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = q.trim()
        ? await EmployeesAPI.search(q.trim())
        : await EmployeesAPI.getAllEmployees();
      setItems(res.data?.data ?? []);
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();
    await load();
  };

  return (
    <div className="container mt-4">
      {/* Header: title + logout */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Employee List</h1>

        <div className="d-flex align-items-center gap-3">
          {user && (
            <span className="text-muted">Logged in as: <strong>{user.username}</strong></span>
          )}

          <button onClick={handleLogout}className="btn btn-outline-danger btn-sm">Logout</button>
        </div>
      </div>

      {/* Search row */}
      <form onSubmit={onSearch} className="mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-8">
            <label className="form-label fw-semibold">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, or department..."
              className="form-control"
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-fill">Search</button>
            <button type="button" className="btn btn-outline-secondary flex-fill"
              onClick={() => {
                setQ("");
                load();
              }}
            > Clear </button>
          </div>
        </div>
      </form>

      {/* Status messages */}
      {err && (<p style={{ color: "tomato", marginTop: 8 }}>Error: {err}</p>)}
      {loading && (
        <p style={{ marginTop: 8 }}>Loading…</p>
      )}

      {/* Add employee aligned right */}
      <div className="d-flex justify-content-start mb-2">
        <button className="btn btn-success" onClick={() => setShowAdd(true)}>+ Add Employee </button>
      </div>

      {/* Table */}
      <table className="table table-striped table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Salary ($)</th>
            <th style={{ width: "240px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e._id}>
              <td>{e.first_name} {e.last_name}</td>
              <td>{e.email}</td>
              <td>{e.department}</td>
              <td>{formatSalary(e.salary)}</td>
              <td>
                <div>
                  <Link to={`/employees/${e._id}`} className="btn btn-primary me-2">View</Link>
                  <Link to={`/employees/${e._id}?edit=1`} className="btn btn-warning me-2">Edit</Link>
                  <Link to={`/employees/${e._id}?delete=1`} className="btn btn-danger me-2">Delete</Link>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && !loading && (
            <tr>
              {/* small fix: colspan should match # of columns (5 here) */}
              <td colSpan="5" className="text-center text-muted py-4">No employees.</td>
            </tr>
          )}
        </tbody>
      </table>


      <Modal
        show={showAdd}
        title="Add Employee"
        onClose={() => setShowAdd(false)}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setErr("");
              await EmployeesAPI.addEmployee({
                first_name: addForm.first_name.trim(),
                last_name: addForm.last_name.trim(),
                email: addForm.email.trim().toLowerCase(),
                department: addForm.department.trim(),
                salary: Number(addForm.salary),
              });
              // reset form
              setAddForm({
                first_name: "",
                last_name: "",
                email: "",
                department: "",
                position: "",
                salary: "",
              });
              setShowAdd(false);
              // reload the list
              await load();
            } catch (err) {
              setErr(err.response?.data?.message || err.message);
            }
          }}
        >
          <div className="mb-3">
            <label className="form-label">First name</label>
            <input
              className="form-control"
              value={addForm.first_name}
              placeholder="Add first name..."
              onChange={(e) =>
                setAddForm((f) => ({ ...f, first_name: e.target.value }))
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Last name</label>
            <input
              className="form-control"
              placeholder="Add last name..."
              value={addForm.last_name}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, last_name: e.target.value }))
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Add email... (example@example.com)"
              value={addForm.email}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              className="form-control"
              placeholder="Add department..."
              value={addForm.department}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, department: e.target.value }))
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Salary</label>
            <input
              className="form-control"
              type="number"
              placeholder="Add salary in dollars..."
              value={addForm.salary}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, salary: e.target.value }))
              }
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={!validateCreate(addForm.first_name,
                addForm.last_name,
                addForm.salary,
                addForm.email,
                addForm.department)}
            >
              Add Employee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );


}
