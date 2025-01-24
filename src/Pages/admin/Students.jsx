import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";

const Students = () => {
  const [users, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      // First get all students IDs
      const { data } = await axios.get(
        "https://aistudiumb-9jub.onrender.com/user/getAllstudents"
      );
      
      // Then fetch detailed info for each student using get-user endpoint
      const detailedUsers = await Promise.all(
        data.user.map(async (user) => {
          try {
            const detailedData = await axios.post(
              "https://aistudiumb-9jub.onrender.com/user/get-user",
              { id: user._id }
            );
            return detailedData.data.user;
          } catch (error) {
            console.error("Error fetching user details:", error);
            return user;
          }
        })
      );
      
      setAllUsers(detailedUsers);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Convert JSON data to CSV format
  const convertToCSV = (data) => {
    const header = ["Name", "Email", "Enrolled Courses"];
    const rows = data.map((user) => [
      user.name,
      user.email,
      user?.enrolledCourses?.length > 0 
        ? user.enrolledCourses.map(course => course?.course?.courseName || 'Unnamed Course').join(", ")
        : "No courses enrolled",
    ]);
    const csvRows = [header.join(","), ...rows.map((row) => row.join(","))];
    return csvRows.join("\n");
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 mt-8">
        <h1 className="text-3xl font-bold mb-4">Students List</h1>
        <button
          onClick={() => {
            const csvData = convertToCSV(users);
            const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "students_list.csv");
            link.click();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          Download CSV
        </button>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left text-lg font-semibold">Name</th>
                <th className="py-2 px-4 text-left text-lg font-semibold">Email</th>
                <th className="py-2 px-4 text-left text-lg font-semibold">
                  Enrolled Courses
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="py-2 px-4">
                      <a 
                        href={`/students/${user._id}`}
                        className="text-blue-600 hover:underline underline-offset-2"
                      >
                        {user.name}
                      </a>
                    </td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">
                      {user?.enrolledCourses?.length > 0
                        ? user.enrolledCourses
                            .map(course => course?.course?.courseName || 'Unnamed Course')
                            .join(", ")
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
        )}
      </div>
    </>
  );
};

export default Students;
