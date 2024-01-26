"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetProfile } from "@/utils/hooks/useProfile";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";
import toast from "react-hot-toast";

export default function Header() {
  const { getProfile } = useGetProfile();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const accessToken = useSelector(
    (state: RootState) => state.authReducer.accessToken
  );

  const authState = useSelector((state: RootState) => state.authReducer.user);

  const handleLogout = () => {
    toast.success("successfully logout");
    Cookies.remove("auth");
    router.push("/login");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile(accessToken);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching user profile", error);
      }
    };

    fetchUserProfile();
  }, [getProfile, accessToken]);

  return (
    <div className="flex justify-end  shadow-md gap-4">
      {showDropdown && (
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              className="transition-transform pr-3 border p-3"
              name={authState.name || "User"}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="User Actions"
            variant="flat"
            className=" p-3 shadow-md"
          >
            <DropdownItem key="profile" className="h-14 gap-2 mb-4">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">{authState.email || "N/A"}</p>{" "}
            </DropdownItem>

            <DropdownItem
              key="logout"
              className="bg-red-100 text-red-500"
              onClick={handleLogout}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
}
