"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { RootState, useDispatch } from "@/redux/store";
import { setAccessToken, setUser } from "@/redux/slices/authSlice";
import { useGetProfile } from "@/utils/hooks/useProfile";
import { useSelector } from "react-redux";

type Token = string | undefined;

const Checkauthentication = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { getProfile } = useGetProfile();
  const { user } = useSelector((state: RootState) => state.authReducer);
  useEffect(() => {
    const retrieveUser = async () => {
      const token: Token = Cookies.get("auth");
      if (!token || !user) {
        router.push("/login");
        return;
      }
      const userData = await getProfile(token);
      if (!userData) {
        router.push("/login");
      }
      console.log("user", userData);
      dispatch(setAccessToken(token));
      dispatch(setUser(userData));
      console.log("successfully added");
    };
    retrieveUser();
  }, []);
  return <>{children}</>;
};

export default Checkauthentication;
