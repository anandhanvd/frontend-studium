import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";

const Students = () => {
  const [users, setAllUsers] = useState([]);

  // Fetch all students data
  const getUsers = async () => {
    try {
      const { data } = await axios.get(
        "https://aistudiumb.onrender.com/user/getAllstudents"
      );
      setAllUsers(data.user);
      console.log(data.user)
    } catch (error) {
      console.log(error);
    }
  };

  // Convert JSON data to CSV format
  const convertToCSV = (data) => {
    const header = ["Name", "Email", "Enrolled Courses"];
    const rows = data.map((user) => [
      user.name,
      user.email,
      user.courses.length > 0 ? user.courses.join(", ") : "No courses enrolled",
    ]);
    const csvRows = [header.join(","), ...rows.map((row) => row.join(","))];
    return csvRows.join("\n");
  };

  // Download CSV file
  const downloadCSV = () => {
    const csvData = convertToCSV(users);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "students_list.csv");
      link.click();
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 mt-8">
        <h1 className="text-3xl font-bold mb-4">Students List</h1>

        {/* Button to download CSV */}
        <button
          onClick={downloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          Download CSV
        </button>

        {/* Table for displaying users */}
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left text-lg font-semibold">
                Name
              </th>
              <th className="py-2 px-4 text-left text-lg font-semibold">
                Email
              </th>
              <th className="py-2 px-4 text-left text-lg font-semibold">
                Enrolled Courses
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-b">
                  <a href={`/students/${user._id}`}><td className="py-2 text-blue-600 hover:underline underline-offset-2 px-4">{user.name}</td></a>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">
                    {user?.enrolledCourses?.length > 0
                      ? user.enrolledCourses.join(", ")
                      : "No courses enrolled"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Students;
