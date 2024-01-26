import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const useDepartmentService = () => {
  const getDepartments = async () => {
    const response = await axios.get(`${BASE_URL}/department`);
    return response.data;
  };

  const createDepartment = async (deptName: string, accessToken: string) => {
    await axios.post(
      `${BASE_URL}/department`,
      { deptName },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  };

  const updateDepartment = async (
    departmentId: string,
    deptName: string,
    accessToken: string
  ) => {
    await axios.put(
      `${BASE_URL}/department/${departmentId}`,
      { deptName },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  };
  const deleteDepartment = async (
    departmentId: string,
    accessToken: string
  ) => {
    await axios.delete(`${BASE_URL}/department/${departmentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  return {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};
