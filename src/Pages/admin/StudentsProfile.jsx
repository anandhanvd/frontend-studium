import React, { useEffect, useState } from "react";
import StudentHeader from "../../components/StudentHeader";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Necessary for Chart.js v3+
import { useParams } from "react-router-dom";
import Header from '../../components/Header'
const StudentsProfile = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [user, setUser] = useState({});
  const userId = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserData = async () => {
    console.log("User ID ", userId)
    try {
      const { data } = await axios.post("https://aistudiumb-9jub.onrender.com/user/get-user", {
        id: userId.userId,
      });
      setUser(data.user)
      console.log("User Data:", data.user); // Log the data to verify the structure
      setEnrolledCourses(data?.user.enrolledCourses || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`https://aistudiumb-9jub.onrender.com/api/results/user/${userId.userId}`);
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch results.");
        setLoading(false);
      }
    };

    fetchResults();
  }, [userId]);


  const chartData = {
    labels: results.map((result) => result.title),
    datasets: [
      {
        label: "Scores",
        data: results.map((result) => result.score),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };


  return (
    <>
      <Header />
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{user.name?.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{user.name}</h1>
              <div className="flex gap-4 mt-4">
                <div className="bg-blue-500/30 px-4 py-2 rounded-lg">
                  <span className="text-white font-medium">Courses: {enrolledCourses.length}</span>
                </div>
                <div className="bg-purple-500/30 px-4 py-2 rounded-lg">
                  <span className="text-white font-medium">Quizzes: {results.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold text-blue-800">Total Courses</h3>
            <p className="text-gray-700 mt-2">{enrolledCourses.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold text-green-800">Completed</h3>
            <p className="text-gray-700 mt-2">
              {enrolledCourses.filter(course => course?.completed >= 100).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold text-yellow-800">Quiz Results</h3>
            <p className="text-gray-700 mt-2">{results.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold text-purple-800">Avg. Score</h3>
            <p className="text-gray-700 mt-2">
              {results.length > 0 
                ? `${Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length)}%`
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Course Progress</h2>
          <div className="space-y-6">
            {enrolledCourses.map((course, index) => {
              const completionPercentage = Math.floor(parseFloat(course?.completed) || 0);
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">{course?.course?.courseName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      completionPercentage >= 75 ? 'bg-green-100 text-green-800' :
                      completionPercentage >= 50 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {completionPercentage}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quiz Results */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Quiz Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {results.map((result) => (
              <div key={result._id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">{result.title}</h3>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    result.score > 80 ? 'bg-green-100 text-green-800' :
                    result.score > 60 ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Score: {result.score}%
                  </span>
                  <span className="text-gray-500 text-sm">
                    {result.timeTaken}s
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Bar data={chartData} />
        </div>
      </div>
    </>
  );
};

export default StudentsProfile;
