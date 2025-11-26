import { useEffect, useMemo, useState } from "react";
import { EmployeesAPI } from "../api";
import { Link, useParams, useLocation } from "react-router-dom";
import { formatSalary } from "../util/format";

export default function Employees() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  // create form state (keep it tiny for now)
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    salary: ""
  });

  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = q.trim()
        ? await EmployeesAPI.search(q.trim())
        : await EmployeesAPI.list();
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

  const canCreate = useMemo(() => {
    return (
      form.first_name.trim() &&
      form.last_name.trim() &&
      form.email.trim() &&
      form.department.trim() &&
      form.salary.trim()
    );
  }, [form]);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!canCreate) return;
    try {
      setErr("");
      await EmployeesAPI.create({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim().toLowerCase(),
        department: form.department.trim(),
        salary: form.salary.trim()
      });
      setForm({ first_name: "", last_name: "", email: "", department: "", salary: "" });
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    }
  };

  const onSearch = async (e) => {
    e.preventDefault();
    await load();
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center my-4">Employee List</h1>

      {/* Search */}
      <form onSubmit={onSearch} >
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…" className="form-control" />
        <div className="col-sm-4 col-md-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary w-100">Search</button>
          <button type="button" className="btn btn-outline-secondary w-100" onClick={() => { setQ(""); load(); }}>Clear</button>
        </div>
      </form>

      {/* Create */}
      <form onSubmit={onCreate} style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(4, 1fr) auto" }}>
        <input placeholder="First name" value={form.first_name} onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))} />
        <input placeholder="Last name" value={form.last_name} onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
        <input placeholder="Department" value={form.department} onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))} />
        <input placeholder="Salary" value={form.salary} onChange={(e) => setForm(f => ({ ...f, salary: e.target.value }))} />
        <button disabled={!canCreate}>Add Employee</button>
      </form>

      {err && <p style={{ color: "tomato", marginTop: 12 }}>Error: {err}</p>}
      {loading && <p style={{ marginTop: 12 }}>Loading…</p>}

      {/* List */}
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
    </div>
  );
}
