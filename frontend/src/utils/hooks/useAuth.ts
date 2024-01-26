import { setUser } from "@/redux/slices/authSlice";
import { Dispatch } from "redux";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { User } from "./useProfile";
import Router from "next/router";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

export interface ErrorRootObject {
  err: Err;
  message: string;
  stack: string;
  status: ResStatus;
}

export interface Err {
  isOperational: boolean;
  status: ResStatus;
  statusCode: number;
}

export interface ResponseRootObject {
  token: string;
  data: Data;
  error: boolean;
  message: string;
  status: ResStatus;
}

export interface Data {
  accessToken: any;
  token: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export enum ResStatus {
  Success = "success",
  Fail = "fail",
}

export interface DecodedToken {
  // Add any other properties present in your decoded token
  role: string;
}

export const useLogin = () => {
  const [response, setResponse] = useState<{
    error: ResStatus;
    message: string;
    data: Data | null;
  }>({
    error: ResStatus.Fail,
    message: "",
    data: null,
  });

  const login = async (body: LoginBody) => {
    try {
      const res = await axios.post<ResponseRootObject & ErrorRootObject>(
        "http://localhost:8080/login",
        body
      );
      const decoded: DecodedToken = jwtDecode(res.data.token);
      if (decoded.role == "employee" || decoded.role == "manager") {
        Cookies.set("auth", res.data.token, { expires: 1 });
      } else {
        console.log("+++++");
      }
      console.log(res.data, ">>>>>>>>>");
      return {
        error: ResStatus.Success,
        message: res.data.message,
        data: {
          accessToken: res.data.token,
        },
      };
    } catch (error) {
      if (axios.isAxiosError<ErrorRootObject, Record<string, unknown>>(error)) {
        setResponse({
          error: ResStatus.Fail,
          message: error.response?.data.message!,
          data: null,
        });
      }
    }
  };
  //   console.log(response);

  return { login, response };
};

export const useLogout = (
  dispatch: Dispatch,
  router: AppRouterInstance | string[]
) => {
  console.log("called logout");
  toast.success("Successfully logged out");
  Cookies.remove("auth");
  dispatch(setUser({} as User));
  router.push("/signin");
};
