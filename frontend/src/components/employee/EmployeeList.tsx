"use client";
import React, { useEffect, useState } from "react";
import { useEmployeeService } from "./EmployeeService";

const EmployeeListPage = () => {
  const { getEmployeesByLocation } = useEmployeeService();
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState({ location: "", name: "" });
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmployeesByLocation(filter.location);
        setEmployees(response.employees);
      } catch (error) {
        console.error("Error fetching employees", error);
        setEmployees([]);
      }
    };

    fetchData();
  }, [getEmployeesByLocation, filter.location]);

  const handleEmployeeClick = (employee: React.SetStateAction<null>) => {
    // Set the selected employee when a list item is clicked
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    // Close the modal by resetting the selected employee
    setSelectedEmployee(null);
  };

  return (
    <div className="max-w-screen-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>

      <ul>
        {Array.isArray(employees) && employees.length > 0 ? (
          employees.map((employee) => (
            <li
              key={employee._id}
              className="bg-gray-100 p-3 mb-2 rounded shadow cursor-pointer"
              onClick={() => handleEmployeeClick(employee)}
            >
              {employee.name} - {employee.location}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No employees found</li>
        )}
      </ul>

      {/* Modal to display employee details */}
      {selectedEmployee && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 max-w-md rounded">
            <h3 className="text-2xl font-bold mb-4">{selectedEmployee.name}</h3>
            <p>email: {selectedEmployee.email}</p>
            <p>Location: {selectedEmployee.location}</p>
            {/* Add more details as needed */}
            {/* Close button */}
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;
