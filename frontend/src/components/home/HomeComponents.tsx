// Department.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetProfile } from "@/utils/hooks/useProfile";
import { useDepartmentService } from "./DepartmentService";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/react";
import Link from "next/link";

interface IDepartment {
  _id: string;
  deptName: string;
}

const Department = () => {
  const dispatch = useDispatch();
  const { getProfile } = useGetProfile();
  const {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartmentService();

  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const accessToken = useSelector(
    (state: RootState) => state.authReducer.accessToken
  );

  const authState = useSelector((state: RootState) => state.authReducer.user);
  const role = authState.role;

  useEffect(() => {
    const fetchDepartments = async () => {
      const departmentData = await getDepartments();
      setDepartments(departmentData);
    };

    if (role === "manager") {
      fetchDepartments();
    }
  }, [getProfile, getDepartments, role]);

  const handleCreateDepartment = async () => {
    await createDepartment(newDepartmentName, accessToken);
    setNewDepartmentName("");
    const updatedDepartments = await getDepartments();
    setDepartments(updatedDepartments);
  };

  const handleUpdateDepartment = async (
    departmentId: string,
    deptName: string
  ) => {
    await updateDepartment(departmentId, deptName, accessToken);
    setEditingDepartmentId(null);
    const updatedDepartments = await getDepartments();
    setDepartments(updatedDepartments);
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (editingDepartmentId === departmentId) {
      return;
    }

    await deleteDepartment(departmentId, accessToken);
    const updatedDepartments = await getDepartments();
    setDepartments(updatedDepartments);
  };

  const myDetails = async () => {
    try {
      const profileData = await getProfile(accessToken);
      console.log("Profile Data:", profileData);
      setUserDetails(profileData);
    } catch (error) {
      console.error("Error fetching profile details", error);
    }
  };

  if (role !== "manager") {
    return (
      <div className="container mx-auto mt-8 p-4">
        <Button
          className="ml-24 bg-black text-white p-4 rounded-md mb-14"
          onClick={myDetails}
        >
          My Details
        </Button>
        {userDetails && (
          <div className="ml-24">
            <p>Name: {userDetails.name}</p>
            <p>Email: {userDetails.email}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <Button className="bg-black text-white p-4 rounded-md mb-14">
        <Link href={"/employee"}>Show All Employee</Link>
      </Button>
      <h2 className="text-2xl font-bold mb-4">Departments</h2>
      {departments.map((department: IDepartment) => (
        <div key={department._id} className="mb-2 p-2 border rounded">
          {editingDepartmentId === department._id ? (
            <input
              className="border border-black"
              type="text"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
            />
          ) : (
            <span>{department.deptName}</span>
          )}
          <button
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              setNewDepartmentName(department.deptName);
              setEditingDepartmentId(department._id);
            }}
          >
            Edit
          </button>
          <button
            className={`ml-2 px-4 py-2 ${
              editingDepartmentId === department._id
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white cursor-not-allowed"
            } rounded`}
            onClick={() =>
              editingDepartmentId === department._id
                ? handleUpdateDepartment(department._id, newDepartmentName)
                : null
            }
            disabled={
              editingDepartmentId === department._id && !newDepartmentName
            }
          >
            Save
          </button>
          <button
            className={`ml-2 px-4 py-2 bg-red-500 text-white rounded ${
              editingDepartmentId === department._id ? "cursor-not-allowed" : ""
            }`}
            onClick={() => handleDeleteDepartment(department._id)}
            disabled={editingDepartmentId === department._id}
          >
            Delete
          </button>
        </div>
      ))}
      <div className="flex items-center mt-4">
        {editingDepartmentId === null && (
          <>
            <input
              className="border border-black p-2 mr-2 flex-1"
              type="text"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleCreateDepartment}
            >
              Create Department
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Department;
