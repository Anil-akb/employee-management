import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

import { ResStatus } from "./useAuth";

export interface ErrRootObject {
  data: any;
  err: Err;
  message: string;
  stack: string;
  status: ResStatus;
}

interface JwtPayload {
  userId: string;
}

export interface Err {
  isOperational: boolean;
  status: ResStatus;
  statusCode: number;
}

export interface ResRootObject {
  data: Data;
  status: ResStatus;
}

export interface Data {
  user: User;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  __v: 0;
}

export const useGetProfile = () => {
  const getProfile = async (accessToken: string): Promise<User> => {
    try {
      const { userId } = jwtDecode(accessToken) as JwtPayload;

      const res = await axios.get<ResRootObject>(
        `http://localhost:8080/user/${userId}`
      );
      console.log(res.data);
      return res.data as unknown as User;
    } catch (error) {
      if (axios.isAxiosError<ErrRootObject>(error)) {
        const axiosError = error as AxiosError<ErrRootObject>;
        throw (
          axiosError.response?.data.message || "Error retrieving user profile"
        );
      } else {
        throw "Unexpected error";
      }
    }
  };

  return { getProfile };
};
