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


  const handleCardClick = (course) => {
    navigate("/generated-course", { state: { courseData: course } });
  };

  useEffect(() => {
  const getCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/gencourse/all/${userId}`);
      
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
      const { data } = await axios.post("https://aistudiumb.onrender.com/user/get-user", {
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
        const response = await axios.get(`https://aistudiumb.onrender.com/api/results/user/${userId}`);
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
      <StudentHeader />
      <div className="container max-w-4xl mt-24 mx-auto bg-gradient-to-r from-sky-200 rounded-lg to-lime-200 p-8">
        <h2 className="text-3xl font-semibold text-center mb-8 text-blue-600">
          Enrolled Courses
        </h2>
        {enrolledCourses.length > 0 ? (
          <div className="space-y-6">
            {enrolledCourses.map((course, index) => {
              // Validate and convert completionPercentage to a valid number
              let completionPercentage = parseFloat(course?.completed);

            
              

              // If it's NaN, set it to 0
              if (isNaN(completionPercentage)) {
                completionPercentage = 0;
              }

              // Round it down to an integer
              completionPercentage = Math.floor(completionPercentage);

              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {course?.course?.courseName}
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className="bg-blue-500 rounded-full text-center text-black ml-5"
                      style={{ width: `${completionPercentage}%` }}
                    >
                      {completionPercentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            You have not enrolled in any courses yet.
          </p>
        )}
      </div>




      <div className="container max-w-4xl mt-24 mx-auto bg-gradient-to-r from-sky-200 rounded-lg to-lime-200 p-8">
  <h2 className="text-3xl font-semibold text-center mb-8 text-blue-600">
    Your AI Generated Courses
  </h2>
  {curatedCourses.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {curatedCourses.map((course, index) => (
        <div
          key={index}
          onClick={() => handleCardClick(course)}
          className="bg-white hover:bg-orange-50 shadow-lg rounded-lg p-4 hover:shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-gray-800">{course.courseTitle}</h3>
          <p className="text-gray-600 mt-2">
            Units: {course.units.length}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500">
      You have not generated any courses yet.
    </p>
  )}
</div>







      <div className="max-w-4xl bg-gradient-to-r from-sky-200 to-lime-200 mx-auto my-8 rounded-lg p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Your Quiz Results</h1>

      {results.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <div
                key={result._id}
                className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-lg font-semibold">{result.title}</p>
                <p className="text-gray-600">
                  <strong>Score:</strong> {result.score}
                </p>
                <p className="text-gray-600">
                  <strong>Time Taken:</strong> {result.timeTaken} seconds
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-center mb-4">Performance Overview</h2>
            <Bar data={chartData} />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No results found.</p>
      )}
    </div>
    </>
  );
};

export default Profile;
