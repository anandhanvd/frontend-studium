import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";

const Questions = () => {
  const quizId = JSON.parse(localStorage.getItem("quizID"));
  const [quizName, setQuizname] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionData, setQuestionData] = useState({
    question: "",
    options: ["", "", "", ""], // Array of 4 options
    correctAns: "",
  });

  // Fetch quiz data including questions
  const getQuiz = async () => {
    try {
      const { data } = await axios.post(
        "https://aistudiumb.onrender.com/course/singleQuiz",
        {
          quizId,
        }
      );
      console.log(data);
      setQuizname(data?.quiz?.quizName);
      setAllQuestions(data?.quiz?.questions);
    } catch (error) {
      console.log(error);
    }
  };

  // Submit a new question to the backend
  const submitQuestion = async () => {
    try {
      const newQuestion = {
        quizId,
        question: questionData.question,
        option: questionData.options,
        correctAns: questionData.correctAns,
      };
      await axios.post("https://aistudiumb.onrender.com/course/addQuestion", newQuestion);
      setQuestionData({
        question: "",
        options: ["", "", "", ""],
        correctAns: "",
      });
      setIsModalOpen(false);
      getQuiz(); // Refresh the questions list
    } catch (error) {
      console.log(error);
    }
  };

  // Delete a question
  const deleteQuestion = async (questionId) => {
    try {
      await axios.post(`https://aistudiumb.onrender.com/ourse/deleteQuestion`, {
        questionId,
      });
      getQuiz(); // Refresh the questions list after deletion
    } catch (error) {
      console.log(error);
    }
  };

  // Handle changes in input fields for the question
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle changes in options input fields
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...questionData.options];
    updatedOptions[index] = value;
    setQuestionData((prevData) => ({
      ...prevData,
      options: updatedOptions,
    }));
  };

  useEffect(() => {
    getQuiz();
  }, []);

  return (
    <>
      <Header />
      <div className="p-4 mt-[50px] flex justify-between items-center">
        <h1 className="text-[40px] font-bold font-mono">{quizName}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Add Question
        </button>
      </div>

      {/* Questions List */}
      <div className="container mx-auto p-4">
        {allQuestions?.length > 0 ? (
          allQuestions?.map((question) => (
            <div
              key={question._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4"
            >
              <h3 className="text-xl font-semibold">{question.question}</h3>
              <ul className="mt-4">
                {question?.option?.map((option, index) => (
                  <li key={index} className="text-md">
                    {index + 1}. {option}
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                <strong>Correct Answer: </strong>
                {question.correctAns}
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => deleteQuestion(question._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No questions available.</p>
        )}
      </div>

      {/* Modal for adding a question */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-3/4 max-w-3xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">
              Add Question
            </h2>
            <div className="space-y-4">
              {/* Question */}
              <div>
                <label className="block font-semibold mb-2">Question</label>
                <input
                  type="text"
                  name="question"
                  value={questionData.question}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the question"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                {questionData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <label className="font-semibold flex justify-center items-center whitespace-nowrap">
                      {`Option ${index + 1}`}
                    </label>

                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* Correct Answer */}
              <div>
                <label className="block font-semibold mb-2">
                  Correct Answer
                </label>
                <input
                  type="text"
                  name="correctAns"
                  value={questionData.correctAns}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter correct answer"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={submitQuestion}
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

export default Questions;
