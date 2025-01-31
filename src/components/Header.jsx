import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiBookLine, RiTeamLine, RiPriceTagLine, RiDashboardLine } from "react-icons/ri";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo/Title */}
        <a href="/course" className="group">
          <h1 className="text-2xl font-bold text-white transform transition-transform group-hover:scale-105">
            AI<span className="text-yellow-300">Studium</span>
          </h1>
        </a>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link
            to="/course"
            className="group flex items-center space-x-2 text-white hover:text-yellow-300 transition-all duration-300"
          >
            <RiBookLine className="text-xl group-hover:scale-125 transition-all duration-300 group-hover:rotate-[360deg]" />
            <span>Courses</span>
          </Link>

          <Link
            to="/students"
            className="group flex items-center space-x-2 text-white hover:text-yellow-300 transition-all duration-300"
          >
            <RiTeamLine className="text-xl group-hover:scale-125 transition-all duration-300 group-hover:rotate-[360deg]" />
            <span>All Students</span>
          </Link>

          <Link
            to="/content"
            className="group flex items-center space-x-2 text-white hover:text-yellow-300 transition-all duration-300"
          >
            <RiPriceTagLine className="text-xl group-hover:scale-125 transition-all duration-300 group-hover:rotate-[360deg]" />
            <span>Content Labelling</span>
          </Link>

          <Link 
            to="/approve-teachers"
            className="group flex items-center space-x-2 text-white hover:text-yellow-300 transition-all duration-300"
          >
            <RiDashboardLine className="text-xl group-hover:scale-125 transition-all duration-300 group-hover:rotate-[360deg]" />
            <span>Teachers</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <Link
          to="/"
          className="group bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-300 flex items-center space-x-2"
        >
          <span>Logout</span>
          <svg 
            className="w-4 h-4 transform transition-transform group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </header>
  );
};

export default Header;
