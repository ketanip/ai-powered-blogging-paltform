"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  UserPlus,
  LogIn,
  PenBox,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="flex max-w-6xl mx-auto py-4 px-6 justify-between items-center font-mono bg-white relative">
        {/* Logo Section */}
        <Link href="/">
          <h4 className="font-bold bg-gradient-to-r from-green-400 via-teal-500 to-yellow-500 text-white rounded-lg px-6 py-3 text-xl shadow-lg transform hover:scale-105 transition-transform border-4 border-teal-400 flex items-center gap-2">
            <FileText className="text-white" />
            Blog 500
          </h4>
        </Link>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="block lg:hidden text-teal-800">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:flex items-center  text-teal-800 font-semibold items md:space-x-8 transition-all duration-300 ease-in-out lg:flex-row flex-col lg:ml-auto absolute lg:relative top-full right-0 bg-white lg:bg-transparent py-4 lg:py-0 px-6 lg:px-0 shadow-lg lg:shadow-none z-10`}
        >
          <Link href="/">
            <span className="hover:text-yellow-500 cursor-pointer transition-colors duration-300 flex items-center gap-1 mb-4 md:mb-0">
              <FileText className="text-teal-800" />
              Latest Blogs
            </span>
          </Link>

          {loggedIn ? (
            <>
              <Link href="/blog/new">
                <span className="hover:text-yellow-500 cursor-pointer transition-colors duration-300 flex items-center gap-1  mb-4 md:mb-0">
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
