import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown } from "lucide-react";
import { RiHome4Line, RiBookReadLine, RiUserSmileLine, RiLogoutBoxLine, RiMenu3Line } from "react-icons/ri";
import { IoSchoolOutline } from "react-icons/io5";
import { TbProgressCheck } from "react-icons/tb";

const StudentHeader = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <Link to="/home" className="group relative flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
              AI<span className="text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300">Studium</span>
            </h1>
            <div className="absolute -inset-2 bg-white/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RiMenu3Line className="text-2xl" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-8">
            <Link to="/home" className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/15 transition-all duration-300">
              <RiHome4Line className="text-2xl group-hover:scale-125 transition-all duration-300 group-hover:rotate-[360deg]" />
              <span className="font-medium">Home</span>
            </Link>

            <Link to="/courses" className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/15 transition-all duration-300">
              <RiBookReadLine className="text-2xl group-hover:scale-125 transition-all duration-300 group-hover:rotate-[360deg]" />
              <span className="font-medium">Learning Hub</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/15 transition-all duration-300">
                <RiUserSmileLine className="text-2xl group-hover:scale-125 transition-all duration-300 group-hover:rotate-[360deg]" />
                <span className="font-medium">Profile</span>
                <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform duration-300" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/95 backdrop-blur-lg rounded-lg shadow-xl mt-2 p-1 min-w-[220px] border border-gray-100">
                <DropdownMenuItem className="flex items-center space-x-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-md transition-colors duration-300 group">
                  <IoSchoolOutline className="text-xl text-indigo-600 group-hover:scale-125 transition-all duration-300 group-hover:rotate-[360deg]" />
                  <Link to="/profile" className="w-full font-medium">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-md transition-colors duration-300 group">
                  <TbProgressCheck className="text-xl text-indigo-600 group-hover:scale-125 transition-all duration-300 group-hover:rotate-[360deg]" />
                  <Link to="/enrolled" className="w-full font-medium">My Learning</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Desktop Logout Button */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center space-x-2 px-6 py-2 bg-yellow-400 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-300 text-blue-900 font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <RiLogoutBoxLine className="text-xl group-hover:scale-125 transition-all duration-300 group-hover:rotate-[360deg]" />
            <span>Logout</span>
          </button>

          {/* Mobile Menu */}
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex-col p-4 shadow-lg`}>
            <Link to="/home" className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-white/15 rounded-lg transition-all duration-300">
              <RiHome4Line className="text-xl" />
              <span>Home</span>
            </Link>
            <Link to="/courses" className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-white/15 rounded-lg transition-all duration-300">
              <RiBookReadLine className="text-xl" />
              <span>Learning Hub</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-white/15 rounded-lg transition-all duration-300">
              <IoSchoolOutline className="text-xl" />
              <span>My Profile</span>
            </Link>
            <Link to="/enrolled" className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-white/15 rounded-lg transition-all duration-300">
              <TbProgressCheck className="text-xl" />
              <span>My Learning</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-white/15 rounded-lg transition-all duration-300 mt-2"
            >
              <RiLogoutBoxLine className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
