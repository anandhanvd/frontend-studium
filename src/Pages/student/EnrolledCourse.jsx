import React, { useEffect, useState } from "react";
import StudentHeader from "../../components/StudentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoVideocamOutline } from "react-icons/io5";
import { PiFileDocDuotone } from "react-icons/pi";

const EnrolledCourse = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const [courses, setCourses] = useState([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const getSingleUser = async () => {
    try {
      const { data } = await axios.post("https://aistudiumb.onrender.com/user/get-user", {
        id: userId,
      });
      setCourses(data?.user?.enrolledCourses);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveEnrollment = async (courseId) => {
    try {
      await axios.post("https://aistudiumb.onrender.com/user/removeEnroll", {
        userId,
        courseId,
      });
      getSingleUser();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAttemptQuiz = (quizzes) => {
    setSelectedQuizzes(quizzes);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuizzes([]);
  };

  const handleNavigateQuiz = (id) => {
    try {
      localStorage.setItem("userQuiz", JSON.stringify(id));
      navigate("/singleQuiz");
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewCourse = (id) => {
    localStorage.setItem("userSelectedCourse", JSON.stringify(id));
    navigate("/singleCourse");
  };

  useEffect(() => {
    getSingleUser();
  }, []);

  return (
    <>
      <StudentHeader />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">My Enrolled Courses</h1>
        {courses?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((enrolled, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden border transform hover:scale-105 transition duration-300"
              >
                <img
                  src={enrolled.course?.image || "placeholder.jpg"}
                  alt={enrolled.course?.courseName || "Course Thumbnail"}
                  className="w-full h-[300px] object-contain"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {enrolled.course?.courseName || "Untitled Course"}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {enrolled.course?.description || "No description available"}
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                      onClick={() => handleViewCourse(enrolled.course?._id)}
                    >
                      View Course
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                      onClick={() =>
                        handleRemoveEnrollment(enrolled.course._id)
                      }
                    >
                      Remove Enrollment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-8">
            You haven't enrolled in any courses yet.
          </p>
        )}
      </div>

      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-lg p-6 relative">
            <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>
            {selectedQuizzes?.length > 0 ? (
              <ul>
                {selectedQuizzes.map((quiz, index) => (
                  <li
                    key={index}
                    className="mb-2 cursor-pointer hover:opacity-80"
                    onClick={() => handleNavigateQuiz(quiz._id)}
                  >
                    <p className="font-bold">
                      {index + 1}. {quiz.quizName}
                    </p>
                    <p>Total Questions: {quiz.questions.length}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No quizzes available for this course.
              </p>
            )}
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EnrolledCourse;
