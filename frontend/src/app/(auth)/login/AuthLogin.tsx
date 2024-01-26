"use client";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/utils/hooks/useAuth";
import { useDispatch } from "@/redux/store";
import { setUser, setAccessToken } from "@/redux/slices/authSlice";
import { useGetProfile } from "@/utils/hooks/useProfile";

import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Link from "next/link";

interface FORMDATA {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const initialState: FORMDATA = {
    email: "",
    password: "",
  };
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FORMDATA>(initialState);

  const dispatch = useDispatch();
  const { login } = useLogin();
  const { getProfile } = useGetProfile();
  const router = useRouter();
  const accessToken = Cookies.get("auth");

  if (accessToken) {
    router.push("/");
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all the fields.");
      return;
    }

    setLoading(true);
    const res = await login({
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);

    if (res?.data.accessToken) {
      const userData = await getProfile(res.data.accessToken);
      dispatch(setAccessToken(res?.data.accessToken));
      dispatch(setUser(userData));
      console.log(userData, "____");
      toast.success("Login Successfully");
      router.push("/");
    } else {
      toast.error("Something went wrong");
    }

    setFormData(initialState);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="text"
              name="email"
              className="mt-1 p-2 w-full border rounded-md"
              value={formData.email}
              onChange={onChangeHandler}
            />
          </div>
          <div className="mb-4">
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
              onChange={onChangeHandler}
            />
          </div>
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
                <>Login</>
              )}
            </button>

            <p className="mt-4">
              Don't have account please?{" "}
              <span className="hover:font-semibold">
                <Link href={"/signup"}>Sign up</Link>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
