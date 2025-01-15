import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo/Title */}
        <a href="/course">
        <h1 className="text-2xl fon  t-bold text-white">
          AI<span className="text-yellow-300">Studium</span>
        </h1>
        </a>
        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link
            to="/course"
            className="text-white hover:text-yellow-300 transition duration-300"
          >
            Courses
          </Link>
          <Link
            to="/students"
            className="text-white hover:text-yellow-300 transition duration-300"
          >
            All Students
          </Link>
          <Link
            to="/content"
            className="text-white hover:text-yellow-300 transition duration-300"
          >
            Content Labelling
          </Link>
        </nav>

        {/* Logout Button */}
        <Link
          to="/"
          className="bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300"
        >
          Logout
        </Link>
      </div>
    </header>
  );
};

export default Header;
