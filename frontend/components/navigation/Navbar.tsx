"use client";

import React, { useEffect, useState } from "react";
import { FileText, UserPlus, LogIn, PenBox, LogOut } from "lucide-react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserData = () => {
      const item = localStorage.getItem("jwt_token");
      setLoggedIn(!!item);
    };

    checkUserData();

    const intervalId = setInterval(checkUserData, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const logout = () => {
    setLoggedIn(false);
    localStorage.clear();
  };

  return (
    <>
      <div className="flex max-w-6xl mx-auto py-8 justify-between font-mono bg-white">
        <Link href="/">
          <h4 className="font-bold bg-gradient-to-r from-green-400 via-teal-500 to-yellow-500 text-white rounded-lg px-6 py-3 text-xl shadow-lg transform hover:scale-105 transition-transform border-4 border-teal-400 flex items-center gap-2">
            <FileText className="text-white" />
            Blog 500
          </h4>
        </Link>
        <div className="flex items-center gap-8 text-teal-800 font-semibold">
          <Link href="/">
            <span className="hover:text-yellow-500 cursor-pointer transition-colors duration-300 flex items-center gap-1">
              <FileText className="text-teal-800" />
              Latest Blogs
            </span>
          </Link>

          {loggedIn ? (
            <>
              <Link href="/blog/new">
                <span className="hover:text-yellow-500 cursor-pointer transition-colors duration-300 flex items-center gap-1">
                  <PenBox className="text-teal-800" />
                  Create A Blog
                </span>
              </Link>

              <span
                className="hover:text-yellow-500 cursor-pointer transition-colors duration-300 flex items-center gap-1"
                onClick={logout}
              >
                <LogOut className="text-teal-800" />
                Logout
              </span>
            </>
          ) : (
            <>
              <Link href="/auth/sign-up">
                <span className="hover:text-yellow-500 cursor-pointer transition-colors duration-300 flex items-center gap-1">
                  <UserPlus className="text-teal-800" />
                  Sign Up
                </span>
              </Link>

              <Link href="/auth/sign-in">
                <span className="hover:text-yellow-500 cursor-pointer transition-colors duration-300 flex items-center gap-1">
                  <LogIn className="text-teal-800" />
                  Login
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Navbar;
