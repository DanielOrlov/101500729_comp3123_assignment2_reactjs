import { useEffect, useState } from "react";
import { EmployeesAPI } from "../api";
import { Link } from "react-router-dom";
import { formatSalary, validateCreate } from "../util/format";
import Modal from "../components/Modal";

export default function Employees() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    salary: "",
  });

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
      <h1 className="text-center my-4">Employee List</h1>
      {/* Search */}
      <form onSubmit={onSearch} >
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, or department..." className="form-control" />
        <div className="col-sm-4 col-md-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary w-100 mt-2">Search</button>
          <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => { setQ(""); load(); }}>Clear</button>
        </div>
      </form>

      {err && <p style={{ color: "tomato", marginTop: 12 }}>Error: {err}</p>}
      {loading && <p style={{ marginTop: 12 }}>Loading…</p>}

      {/* List */}
      <button className="btn btn-success my-2 mx-2" onClick={() => setShowAdd(true)}>+ Add Employee</button>
      <table className="table table-striped table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Salary($)</th>
            <th style={{ width: "220px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e._id}>
              <td>{e.first_name} {e.last_name}</td>
              <td>{e.email}</td>
              <td>{e.department}</td>
              <td>{formatSalary(e.salary)}</td>
              <td className="d-flex align-items-center gap-1">
                <Link to={`/employees/${e._id}`} className="btn btn-primary">View</Link>
                <Link to={`/employees/${e._id}?edit=1`} className="btn btn-warning" >Edit</Link>
                <Link to={`/employees/${e._id}?delete=1`} className="btn btn-danger" >Delete</Link>
              </td>
            </tr>
          ))}
          {items.length === 0 && !loading && (
            <tr><td colSpan="4" className="text-center text-muted py-4">No employees.</td></tr>
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
