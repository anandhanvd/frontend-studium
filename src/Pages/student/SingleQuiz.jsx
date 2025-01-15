import React, { useEffect, useState } from "react";
import StudentHeader from "../../components/StudentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SingleQuiz = () => {
  const navigate = useNavigate();
  const quizId = JSON.parse(localStorage.getItem("userQuiz"));
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getSingleQuiz = async () => {
    try {
      const { data } = await axios.post(
        "https://aistudiumb.onrender.com/course/singleQuiz",
        {
          quizId,
        }
      );
      setQuiz(data?.quiz);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleQuiz();
  }, []);

  const handleOptionSelect = (questionId, option) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: option });
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    quiz.questions.forEach((question) => {
      if (selectedAnswers[question._id] === question.correctAns) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setShowModal(true);
  };

  if (!quiz) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-2xl font-bold text-gray-700">Loading Quiz...</p>
      </div>
    );
  }

  return (
    <>
      <StudentHeader />

      <div className="bg-gray-100 min-h-screen py-10">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6">
            {quiz.quizName}
          </h1>
          {quiz.questions.map((question, index) => (
            <div key={question._id} className="mb-6">
              <p className="text-lg font-semibold mb-4">
                {index + 1}. {question.question}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {question.option.map((opt, optIndex) => (
                  <button
                    key={optIndex}
                    onClick={() => handleOptionSelect(question._id, opt)}
                    className={`px-4 py-2 rounded-md text-white ${
                      selectedAnswers[question._id] === opt
                        ? "bg-green-500"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white py-3 mt-6 rounded-lg hover:bg-purple-700"
          >
            Submit Quiz
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-md text-center">
              <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
              <p className="text-lg">
                You scored{" "}
                <span className="font-bold text-green-500">{score}</span> out of{" "}
                <span className="font-bold text-blue-500">
                  {quiz.questions.length}
                </span>
                .
              </p>
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/enrolled");
                }}
                className="mt-6 bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
              >
                Close and go back
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleQuiz;
