import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const useEmployeeService = () => {
  const getEmployees = async () => {
    const response = await axios.get(`${BASE_URL}/employee`);
    return response.data;
  };

  const createEmployee = async (
    name: string,
    email: string,
    password: string,
    location: string,
    departmentId: string,
    accessToken: string
  ) => {
    await axios.post(
      `${BASE_URL}/employee`,
      { name, email, password, location, departmentId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  };

  const getEmployeeDetails = async (employeeId: string) => {
    const response = await axios.get(`${BASE_URL}/employee/${employeeId}`);
    return response.data;
  };

  const updateEmployee = async (
    employeeId: string,
    name: string,
    email: string,
    location: string,
    accessToken: string
  ) => {
    await axios.put(
      `${BASE_URL}/employee/${employeeId}`,
      { name, email, location },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  };

  const deleteEmployee = async (employeeId: string, accessToken: string) => {
    await axios.delete(`${BASE_URL}/employee/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const getEmployeesByLocation = async (location: string) => {
    const response = await axios.get(`${BASE_URL}/location/employee`, {
      params: { location },
    });
    return response.data;
  };

  const getEmployeesByName = async (name: string, sortOrder: string) => {
    const response = await axios.get(`${BASE_URL}/name/employee`, {
      params: { name, sortOrder }, // Pass sortOrder as a query parameter
    });
    return response.data;
  };

  return {
    getEmployees,
    createEmployee,
    getEmployeeDetails,
    updateEmployee,
    deleteEmployee,
    getEmployeesByLocation,
    getEmployeesByName,
  };
};
