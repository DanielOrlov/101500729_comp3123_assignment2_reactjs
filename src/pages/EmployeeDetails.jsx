import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { EmployeesAPI } from "../api";
import Modal from "../components/Modal";

import { formatDate, formatSalary, validateEdit } from "../util/format";

export default function EmployeeDetails() {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [editForm, setEditForm] = useState({
        first_name: "",
        last_name: "",
        position: "",
        salary: "",
        email: "",
        department: "",
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const shouldAutoOpenEdit = searchParams.get("edit") === "1";
    const shouldAutoOpenDelete = searchParams.get("delete") === "1";

    useEffect(() => {
        const load = async () => {
            try {
                setError("");
                setLoading(true);
                const res = await EmployeesAPI.getEmployeeById(id);
                const emp = res.data?.data;
                setEmployee(emp);

                if (emp) {
                    setEditForm({
                        first_name: emp.first_name || "",
                        last_name: emp.last_name || "",
                        position: emp.position || "",
                        salary: emp.salary || "",
                        email: emp.email || "",
                        department: emp.department || "",
                    });
                }
            } catch (e) {
                setError(e.response?.data?.message || e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    useEffect(() => {
        const load = async () => {
            try {
                setError("");
                setLoading(true);
                const res = await EmployeesAPI.getEmployeeById(id);
                setEmployee(res.data?.data);
            } catch (e) {
                setError(e.response?.data?.message || e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    useEffect(() => {
        if (!loading && employee && shouldAutoOpenEdit) {
            setShowEdit(true);
        }
        else if (!loading && employee && shouldAutoOpenDelete) {
            setShowDelete(true);
        }
    }, [loading, employee, shouldAutoOpenDelete]);

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading…</span>
                </div>
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error || "Employee not found"}
                </div>

                <Link to="/employees" className="btn btn-warning text-dark text-decoration-none">
                    Back to Employees
                </Link>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <h3 className="text-center my-4">Employee Details</h3>

            <Link to="/employees" className="btn btn-secondary mb-2">
                &larr; Back to Employees
            </Link>

            <div className="card">
                <div className="card-header">

                    <h4 className="mb-0">
                        {employee.first_name} {employee.last_name}
                    </h4>
                </div>
                <div className="card-body">
                    <dl className="row mb-0">

                        <dt className="col-sm-3">ID</dt>
                        <dd className="col-sm-9">{employee._id}</dd>

                        <dt className="col-sm-3">Email</dt>
                        <dd className="col-sm-9">{employee.email}</dd>

                        <dt className="col-sm-3">Position</dt>
                        <dd className="col-sm-9">{employee.position}</dd>

                        <dt className="col-sm-3">Department</dt>
                        <dd className="col-sm-9">{employee.department}</dd>

                        <dt className="col-sm-3">Salary</dt>
                        <dd className="col-sm-9">{formatSalary(employee.salary)}</dd>

                        <dt className="col-sm-3">Employee since</dt>
                        <dd className="col-sm-9">{formatDate(employee.date_of_joining)}</dd>



                    </dl>
                </div>
            </div>
            <button className="btn btn-warning my-2 mx-2" onClick={() => setShowEdit(true)}>Edit Employee</button>
            <button className="btn btn-danger my-2 mx-2" onClick={() => setShowDelete(true)}>Delete Employee</button>

            <Modal show={showEdit} title="Edit Employee" onClose={() => setShowEdit(false)}>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            const res = await EmployeesAPI.updateEmployee(id, editForm);
                            setEmployee(res.data.data);
                            setShowEdit(false);
                        } catch (err) {
                            setError(err.response?.data?.message || err.message);
                        }
                    }}
                >
                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                            className="form-control"
                            value={editForm.first_name}
                            onChange={(e) =>
                                setEditForm((f) => ({ ...f, first_name: e.target.value }))
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            className="form-control"
                            value={editForm.last_name}
                            onChange={(e) =>
                                setEditForm((f) => ({ ...f, last_name: e.target.value }))
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            className="form-control"
                            type="email"
                            value={editForm.email}
                            onChange={(e) =>
                                setEditForm((f) => ({ ...f, email: e.target.value }))
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Position</label>
                        <input
                            className="form-control"
                            value={editForm.position}
                            onChange={(e) =>
                                setEditForm((f) => ({ ...f, position: e.target.value }))
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Department</label>
                        <input
                            className="form-control"
                            value={editForm.department}
                            onChange={(e) =>
                                setEditForm((f) => ({ ...f, department: e.target.value }))
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Salary</label>
                        <input
                            className="form-control"
                            value={editForm.salary}
                            onChange={(e) =>
                                setEditForm((f) => ({ ...f, salary: e.target.value }))
                            }
                        />
                    </div>

                    <div class-name="modal-footer">
                        <button type="button" className="btn btn-secondary my-2 mx-2" onClick={() => setShowEdit(false)}>Cancel</button>
                        <button 
                            disabled={!validateEdit(editForm.first_name, 
                            editForm.last_name, 
                            editForm.position, editForm.salary, 
                            editForm.email, editForm.department)}
                            type="submit" className="btn btn-primary my-2 mx-2">Save changes</button>
                    </div>


                </form>
            </Modal>

            <Modal
                show={showDelete}
                title="Delete Employee"
                onClose={() => setShowDelete(false)}
            >
                <p>
                    Are you sure you want to delete{" "}
                    <strong>{employee.first_name} {employee.last_name}</strong>?
                    This action cannot be undone.
                </p>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => setShowDelete(false)}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={async () => {
                            try {
                                setError("");
                                await EmployeesAPI.deleteEmployee(id);
                                setShowDelete(false);
                                navigate("/employees"); // go back to list
                            } catch (err) {
                                setError(err.response?.data?.message || err.message);
                            }
                        }}
                    >
                        Yes, delete
                    </button>
                </div>
            </Modal>

        </div>

    );
}
