import React, { useEffect, useState } from "react";
import StudentHeader from "../../components/StudentHeader";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Necessary for Chart.js v3+
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [curatedCourses, setCuratedCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'quizzes', 'stats'

  const handleCardClick = (course) => {
    navigate("/generated-course", { state: { courseData: course } });
  };

  useEffect(() => {
  const getCourses = async () => {
    try {
      const response = await axios.get(`https://aistudiumb-9jub.onrender.com/gencourse/all/${userId}`);
      
      setCuratedCourses(response.data.courses)
      console.log("Curated Courses by You : ", response.data.courses)
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  getCourses()
}, [userId]);

  const getUserData = async () => {
    try {
      const { data } = await axios.post("https://aistudiumb-9jub.onrender.com/user/get-user", {
        id: userId,
      });
      
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
        const response = await axios.get(`https://aistudiumb-9jub.onrender.com/api/results/user/${userId}`);
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

  const getEnrolledCourseProgress = (courseId) => {
    try {
      const progressData = localStorage.getItem(`enrolled-course-${courseId}-progress`);
      if (progressData) {
        const { completed } = JSON.parse(progressData);
        return completed || 0;
      }
    } catch (error) {
      console.error('Error getting enrolled course progress:', error);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      
      {/* Profile Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pt-20 pb-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-6">
            {/* Profile Avatar */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-blue-100 text-lg">{user.email}</p>
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

      {/* Navigation Tabs - Elevated */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2">
          {['courses', 'quizzes', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'courses' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Enrolled Courses Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Enrolled Courses</h2>
              <div className="space-y-4">
                {enrolledCourses.map((course, index) => {
                  // Get progress from localStorage
                  const progressData = localStorage.getItem(`enrolled-course-${course?.course?._id}-progress`);
                  let completionPercentage = 0;
                  
                  if (progressData) {
                    const { completed } = JSON.parse(progressData);
                    completionPercentage = Math.floor(parseFloat(completed));
                  }

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

            {/* AI Generated Courses Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">AI Generated Courses</h2>
              <div className="grid gap-4">
                {curatedCourses.map((course, index) => (
                  <div
                    key={index}
                    onClick={() => handleCardClick(course)}
                    className="group bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-blue-200"
                  >
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {course.courseTitle}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {course.units.length} Units
                      </span>
                      <span className="text-gray-500 text-sm">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Quiz Results</h2>
            <div className="space-y-4">
              {results.map((result) => (
                <details key={result._id} className="group">
                  <summary className="cursor-pointer bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors list-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          result.score > 80 ? 'bg-green-100 text-green-700' :
                          result.score > 60 ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {result.score}%
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{result.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <div className="mt-4 pl-20 pr-4 pb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-500">Time Taken</span>
                        <p className="font-medium text-gray-800">{result.timeTaken} seconds</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-500">Questions</span>
                        <p className="font-medium text-gray-800">{result.totalQuestions || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Performance Analytics</h2>
            <div className="aspect-w-16 aspect-h-9">
              <Bar 
                data={{
                  ...chartData,
                  datasets: [{
                    ...chartData.datasets[0],
                    backgroundColor: results.map(r => 
                      r.score > 80 ? 'rgba(34, 197, 94, 0.6)' :
                      r.score > 60 ? 'rgba(59, 130, 246, 0.6)' :
                      'rgba(239, 68, 68, 0.6)'
                    ),
                    borderColor: results.map(r =>
                      r.score > 80 ? 'rgb(34, 197, 94)' :
                      r.score > 60 ? 'rgb(59, 130, 246)' :
                      'rgb(239, 68, 68)'
                    ),
                    borderWidth: 2,
                    borderRadius: 6,
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    },
                    title: {
                      display: true,
                      text: 'Quiz Performance History',
                      font: {
                        size: 16,
                        weight: 'bold'
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: value => `${value}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
