import { useEffect, useMemo, useState } from "react";
import { EmployeesAPI } from "../api";

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
      setForm({ first_name: "", last_name: "", email: "", department: "", salary: ""});
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      setErr("");
      await EmployeesAPI.remove(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    }
  };

  const onPatchDept = async (id, current) => {
    const department = window.prompt("New department:", current || "");
    if (department == null) return; // cancelled
    try {
      setErr("");
      const res = await EmployeesAPI.patchDepartment(id, department);
      // optimistic replace
      setItems((prev) => prev.map((x) => (x._id === id ? res.data.data : x)));
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    }
  };

  const onSearch = async (e) => {
    e.preventDefault();
    await load();
  };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h1>Employees</h1>

      {/* Search */}
      <form onSubmit={onSearch} style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email…"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={() => { setQ(""); load(); }}>Clear</button>
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
      <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Department</th>
            <th style={th}>Salary($)</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e._id}>
              <td style={td}>{e.first_name} {e.last_name}</td>
              <td style={td}>{e.email}</td>
              <td style={td}>{e.department}</td>
              <td style={td}>{e.salary}</td>
              <td style={td}>
                <button onClick={() => onPatchDept(e._id, e.department)}>Change dept</button>{" "}
                <button onClick={() => onDelete(e._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && !loading && (
            <tr><td colSpan="4" style={{ padding: 16, opacity: 0.7 }}>No employees.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const th = { textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px 6px" };
const td = { borderBottom: "1px solid #eee", padding: "8px 6px" };
