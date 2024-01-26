"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AuthSignup = () => {
  const [userType, setUserType] = useState("manager");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    location: "",
  });

  const handleUserTypeChange = (type: React.SetStateAction<string>) => {
    setUserType(type);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: type === "manager" ? "manager" : "employee",
      location: type === "manager" ? "" : "",
    });
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      if (!formData.email || !formData.password || !formData.name) {
        toast.error("Please fill in all the fields.");
        return;
      }

      setLoading(true);

      if (userType === "manager") {
        const response = await axios.post(
          `http://localhost:8080/register`,
          formData
        );
        toast.success("Manager Signup Successful");
        router.push("/login");
        console.log("Manager Signup Successful:", response.data);
      } else if (userType === "employee") {
        const response = await axios.post(
          `http://localhost:8080/employee`,
          formData
        );
        toast.success("Employee Signup Successful");
        router.push("/employee-dashboard");
        console.log("Employee Signup Successful:", response.data);
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border shadow-xl   p-12">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <div className="flex space-x-4 mb-4 ">
          <Button
            onClick={() => handleUserTypeChange("manager")}
            className={`px-4 py-2 ${
              userType === "manager" ? "bg-blue-500 text-white" : "bg-gray-300"
            } rounded`}
          >
            Manager
          </Button>
          <Button
            onClick={() => handleUserTypeChange("employee")}
            className={`px-4 py-2 ${
              userType === "employee" ? "bg-blue-500 text-white" : "bg-gray-300"
            } rounded`}
          >
            Employee
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="mt-1 p-2 w-full border rounded-md"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="text"
              name="email"
              className="mt-1 p-2 w-full border rounded-md"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="mt-1 p-2 w-full border rounded-md"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex  top-4 items-center pr-2 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {userType === "employee" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Location
              </label>
              <input
                type="text"
                name="location"
                className="mt-1 p-2 w-full border rounded-md"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="mb-5">
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer flex items-center justify-center rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
            >
              {loading ? (
                <>
                  <span className="sr-only">Loading...</span>
                  <Loader2 className="ml-4 w-6 h-6 animate-spin" />
                </>
              ) : (
                <>Sign Up</>
              )}
            </button>

            <p className="mt-4">
              Already have an account please?{" "}
              <span className="hover:font-semibold">
                <Link href={"/login"}>Log in</Link>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthSignup;
