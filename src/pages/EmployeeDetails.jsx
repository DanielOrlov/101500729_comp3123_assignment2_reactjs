import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: "https://101500729-comp3123-assignment1.vercel.app/api",
});

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        setLoading(true);
        const res = await api.get(`/v1/employees/${id}`);
        setEmployee(res.data?.data);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

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

  const formatDate = (value) => {
    const date = new Date(value)
    return new Intl.DateTimeFormat("en-US",{
        month: "long",
        day: "numeric",
        year: "numeric"
    }).format(date);
  }

  const formatSalary = (value) => {
    return new Intl.NumberFormat("en-US",{
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0
    }).format(value) + " per year";
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
    </div>
  );
}
