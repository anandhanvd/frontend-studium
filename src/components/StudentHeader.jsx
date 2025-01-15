import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { FaBookOpen } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

const StudentHeader = () => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-white">
            AI<span className="text-yellow-300">Studium</span>
          </h1>
        </Link>

        {/* Navigation Icons */}
        <nav className="flex space-x-6 items-center">
          {/* Home Icon */}
          <div className="group relative">
            <Link to="/home">
              <AiFillHome className="text-white text-3xl hover:text-yellow-300 transition duration-300 cursor-pointer" />
            </Link>
            <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300">
              Home
            </span>
          </div>

          {/* All Courses Icon */}
          <div className="group relative">
            <Link to="/courses">
              <FaBookOpen className="text-white text-3xl hover:text-yellow-300 transition duration-300 cursor-pointer" />
            </Link>
            <span className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300">
              All Courses
            </span>
          </div>

          {/* Profile Icon */}
          <div
            className="group relative"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <div className="flex items-center space-x-1 cursor-pointer">
              <AiOutlineUser className="text-white text-3xl hover:text-yellow-300 transition duration-300" />
              <IoMdArrowDropdown className="text-white text-xl hover:text-yellow-300 transition duration-300" />
            </div>
            <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300">
              Profile
            </span>
            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute top-full w-44 right-[-20px] mt-2 bg-white shadow-lg rounded-md overflow-hidden z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 transition"
                >
                  Profile
                </Link>
                <Link
                  to="/enrolled"
                  className="block px-4 py-2 hover:bg-gray-100 transition"
                >
                  Enrolled Courses
                </Link>
                <Link
                  to="/aiCourse"
                  className="block px-4 py-2 hover:bg-gray-100 transition"
                >
                  AI Curated Course
                </Link>
                <Link
                  to="/aiMCQ"
                  className="block px-4 py-2 hover:bg-gray-100 transition"
                >
                  AI Curated MCQ
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Logout Button */}
        <Link
          to="/"
          className="bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300 flex items-center"
        >
          <AiOutlineLogout className="mr-2 text-lg" /> Logout
        </Link>
      </div>
    </header>
  );
};

export default StudentHeader;
