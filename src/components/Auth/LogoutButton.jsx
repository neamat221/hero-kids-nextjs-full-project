"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = ({ className = "" }) => {
  const router = useRouter();

  const handleClick = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      <FiLogOut /> Logout
    </button>
  );
};

export default LogoutButton;
