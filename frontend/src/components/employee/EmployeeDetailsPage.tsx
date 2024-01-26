"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getEmployees } from "@/api/employeeApi"; // Create API call for fetching employees

const EmployeeListPage = () => {
  const dispatch = useDispatch();
  const employees = useSelector(
    (state: RootState) => state.employeeReducer.employees
  );

  useEffect(() => {
    // Fetch employees when the component mounts
    dispatch(getEmployees());
  }, [dispatch]);

  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeListPage;
