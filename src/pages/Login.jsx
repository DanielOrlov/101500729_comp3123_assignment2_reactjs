import { useEffect, useState } from "react";
import { UsersAPI } from "../api";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";

export default function Login() {
  return (
    <div className="container mt-4">
      <h1 className="text-center my-4">Login</h1>
      <h3 className="text-center my-4">Employee Details</h3>

      <Link to="/employees" className="btn btn-secondary mb-2">
        &larr; Back to Employees
      </Link>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await UsersAPI.login(`/v1/users/login`);
            //setEmployee(res.data.data);
            //setShowEdit(false);
          } catch (err) {
            //setError(err.response?.data?.message || err.message);
          }
        }}>

      </form>

      <div className="card">
        <div className="card-header">

          <h4 className="mb-0">
            Name LastName
          </h4>
        </div>
        <div className="card-body">
          <dl className="row mb-0">

            <dt className="col-sm-3">ID</dt>
            <dd className="col-sm-9">empId</dd>

            <dt className="col-sm-3">Email</dt>
            <dd className="col-sm-9">email.com</dd>

            <dt className="col-sm-3">Position</dt>
            <dd className="col-sm-9">nice position</dd>

            <dt className="col-sm-3">Department</dt>
            <dd className="col-sm-9">better department</dd>

            <dt className="col-sm-3">Salary</dt>
            <dd className="col-sm-9">good salary</dd>

            <dt className="col-sm-3">Employee since</dt>
            <dd className="col-sm-9">date</dd>



          </dl>
        </div>
      </div>
      <button className="btn btn-warning my-2 mx-2" onClick={() => { }}>Edit Employee</button>
      <button className="btn btn-danger my-2 mx-2" onClick={() => { }}>Delete Employee</button>
    </div>
  );

}
