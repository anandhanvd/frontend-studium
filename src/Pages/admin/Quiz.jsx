import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();
  const courseId = JSON.parse(localStorage.getItem("courseID"));
  const [courseName, setCourseName] = useState(null);
  const [allQuiz, setAllQuiz] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizName, setQuizName] = useState("");

  const getSingleCourse = async () => {
    try {
      const { data } = await axios.post(
        "https://aistudiumb.onrender.com/course/singleCourse",
        {
          courseId,
        }
      );
      setCourseName(data?.course?.courseName);
      setAllQuiz(data?.course?.quizes);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const submitQuiz = async () => {
    try {
      const quizData = {
        courseId,
        quizName,
      };
      await axios.post("https://aistudiumb.onrender.com/course/createQuiz", quizData);
      setQuizName("");
      toggleModal();
      getSingleCourse();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      await axios.post(`https://aistudiumb.onrender.com/course/deleteQuiz`, {
        quizId,
      });
      getSingleCourse();
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuestion = async (id) => {
    try {
      localStorage.setItem("quizID", JSON.stringify(id));
      navigate("/question");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleCourse();
  }, []);

  return (
    <>
      <Header />
      <div className="p-4 mt-[30px] flex justify-between items-center">
        <h1 className="font-bold text-[50px] font-mono">{courseName}</h1>
        <button
          onClick={toggleModal}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Add Quiz
        </button>
      </div>

      {/* Quizzes List */}
      <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allQuiz.length > 0 ? (
          allQuiz.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <h2 className="text-xl font-bold mb-4">{quiz.quizName}</h2>
              <p>
                <strong>No. of Questions:</strong> {quiz.questions.length}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleQuestion(quiz._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Add Questions
                </button>
                <button
                  onClick={() => deleteQuiz(quiz._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No quizzes available.</p>
        )}
      </div>

      {/* Modal for adding a quiz */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-3/4 max-w-3xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Add Quiz</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Quiz Name</label>
                <input
                  type="text"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quiz name"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={toggleModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={submitQuiz}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Quiz;
