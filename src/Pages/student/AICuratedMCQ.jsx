import React, { useState, useEffect } from "react";
import StudentHeader from "../../components/StudentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from "react-router-dom";

const AICuratedMCQ = () => {
  const location = useLocation();
  const initialFormData = location.state?.formData;
  const [formData, setFormData] = useState(initialFormData || {
    subject: "",
    focus_area: "",
    difficulty: "",
    units: 1,
  });
  const [levelData, setLevelData] = useState({
    score:2,
    time_taken:5
  });

  
  const initialQuizData = location.state?.quizData; // Get data from location.state
  const initialcourseTitle = location.state?.courseTitle;
  const [quizData, setQuizData] = useState(initialQuizData || []); // Initialize state with location data or an empty array
  const [courseTitle, setCourseTitle] = useState(initialcourseTitle || "");
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds
  const [startTime, setStartTime] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [quizTimeTaken, setQuizTimeTaken] = useState(null);
  
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPerfModal, setShowPerfModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [chatStep, setChatStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [courseData, setCourseData] = useState(null);
  const [courseRecom, setCourseRecom] = useState({})

  
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", message: "Hello! Let's create your quiz. What subject should it be about?" },
  ]);
  const [level, setLevel] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserMessage = () => {
    if (!userInput.trim()) return;

    // Add user message to the chat history
    setChatHistory([...chatHistory, { sender: "user", message: userInput }]);

    // Update the form data based on the current step
    if (chatStep === 0) setFormData({ ...formData, subject: userInput });
    if (chatStep === 1) setFormData({ ...formData, difficulty: userInput });
    if (chatStep === 2) setFormData({ ...formData, focus_area: userInput });

    // Move to the next step or submit the data
    if (chatStep < questions.length - 1) {
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", message: questions[chatStep + 1] },
        ]);
        setChatStep(chatStep + 1);
      }, 1000); // Simulate bot response delay
    } else {
      setTimeout(() => {
        fetchQuiz();
      }, 1000);
    }

    setUserInput("");
  };
  const handleViewCourse = () => {
    navigate('/generated-course', { state: { courseData } });
  };





  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://ml-mvqr.onrender.com/mcq/generate-question",
        formData
      );
      setQuizData(response.data.units[0].assessment.unitAssessment);
      console.log("Quiz Data : ", response.data)
      
      setLoading(false);
      
      // Start timer when quiz loads
      setStartTime(Date.now());
      setIsTimerRunning(true);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      setLoading(false);
    }
  };

  const handleGenerateRecom = async () => {
    const recomData = {
      student_level: level,
      course: courseTitle
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://ml-mvqr.onrender.com/course/course-recommendation",
        recomData
      );
      setCourseRecom(response.data);
      console.log("RECOMMENDATION DATA : ", response.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const questions = [
    "What is the subject for your quiz?",
    "What difficulty level do you prefer? (easy, medium, hard)",
    "What is the focus area for the quiz?",
  ];

  const [progress, setProgress] = useState(0);

  const handleGenerateCourse = async () => {
    setLoading(true);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const response = await axios.post(
        "https://ml-mvqr.onrender.com/generator/generate-course",
        formData
      );
      clearInterval(progressInterval);
      setProgress(100);
      setCourseData(response.data);
      console.log("Generated course data:", response.data);
      
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setShowUnitModal(false);
      }, 500);
    } catch (error) {
      console.log("Error", error);
      clearInterval(progressInterval);
      setLoading(false);
      setProgress(0);
    }
  };


  const fetchLevel = async () => {
    try {
      
      console.log("Input for Level Prediction : ", levelData)
      const response = await axios.post(
        "https://ml-mvqr.onrender.com/mcq/predict-level",
        levelData
      );
      setLevel(response.data)
      console.log(response)
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };


  const handleOptionChange = (questionId, selectedOption) => {
    setUserAnswers({ ...userAnswers, [questionId]: selectedOption });
  };

  const handleSubmit = () => {
    setIsTimerRunning(false);
    
    let correctAnswers = 0;
    const detailedResults = [];
    
    quizData.forEach((topic) => {
      topic.questions.forEach((question) => {
        const isCorrect = userAnswers[question.questionId] === question.correctAnswer;
        if (isCorrect) correctAnswers += 1;
        
        detailedResults.push({
          question: question.question,
          correctAnswer: question.correctAnswer,
          userAnswer: userAnswers[question.questionId] || "Not Answered",
          explanation: question.explanation,
          isCorrect,
        });
      });
    });

    // Calculate actual time taken in seconds
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    const resultData = {
      title: courseTitle,
      score: correctAnswers,
      timeTaken: timeTaken,
      userId: user._id,
    };

    // Update levelData with actual score and time
    setLevelData({
      score: correctAnswers,
      time_taken: timeTaken
    });
    fetchLevel(); // Call fetchLevel after updating levelData

    postQuizResult(resultData);
    setScore(correctAnswers);
    setQuizTimeTaken(timeTaken);
    setResults(detailedResults);
    setShowModal(true);
  };

  const postQuizResult = async (resultsData) => {
    try {
      const response = await axios.post(
        "https://aistudiumb-9jub.onrender.com/api/results/save",
        resultsData
      );
      
      // Handle success
      toast.success("Result saved successfully:");
      
    } catch (error) {
      
      toast.warning("Failed to save quiz result. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let timerInterval;
    if (isTimerRunning && timeRemaining > 0) {
      timerInterval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isTimerRunning]);

  useEffect(() => {
    if (quizData.length > 0 && !isTimerRunning) {
      setTimeRemaining(900); // Reset to 15 minutes (900 seconds)
      setStartTime(Date.now());
      setIsTimerRunning(true);
    }
  }, [quizData]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <StudentHeader />
      <div className="mt-16 md:mt-24">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-blue-600 mb-4 md:mb-8">
          AI Chatbot Quiz Creator
        </h2>

        <div className="bg-sky-200 p-4 md:p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <div className="chat-box h-48 md:h-64 overflow-y-auto bg-gray-100 p-4 md:p-8 rounded-lg mb-4">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded ${
                  chat.sender === "user" 
                    ? "bg-blue-200 w-fit ml-auto" 
                    : "bg-gray-300 w-fit"
                }`}
              >
                {chat.message}
              </div>
            ))}
          </div>

          {quizData.length === 0 && (
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Type your answer..."
                disabled={loading}
              />
              <button
                onClick={handleUserMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
                disabled={loading}
              >
                Send
              </button>
            </div>
          )}
        </div>

        {/* Quiz Section */}
        {quizData.length > 0 && (
          <div className="bg-gray-100 w-full max-w-4xl mx-auto mt-6 md:mt-10 shadow-lg rounded-lg p-4 md:p-6">
            {/* Timer Section */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <div className="text-blue-600 font-semibold">
                Total Questions: {quizData.reduce((acc, topic) => acc + topic.questions.length, 0)}
              </div>
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <FaClock className="text-xl" />
                Time Remaining: {formatTime(timeRemaining)}
              </div>
            </div>

            {/* Questions */}
            {quizData.map((topic, topicIndex) => (
              <div key={topicIndex} className="mb-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 bg-blue-100 p-3 rounded-lg shadow">
                  {topic.topic}
                </h3>
                {topic.questions.map((question) => (
                  <div
                    key={question.questionId}
                    className="mb-6 bg-gray-50 p-3 md:p-4 rounded-lg shadow"
                  >
                    <p className="text-base md:text-lg font-medium text-gray-700 mb-4">
                      {question.question}
                    </p>
                    {question.options.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-2 mb-3 cursor-pointer bg-white p-2 rounded-lg border hover:border-blue-500 shadow"
                      >
                        <input
                          type="radio"
                          name={question.questionId}
                          value={option}
                          onChange={() => handleOptionChange(question.questionId, option)}
                          className="accent-blue-500"
                        />
                        <span className="text-sm md:text-base">{option}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white font-bold py-2 px-4 md:px-6 rounded-lg shadow hover:bg-green-600 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
              >
                <FaCheckCircle className="text-xl" />
                <span>Submit Quiz</span>
              </button>
            </div>
          </div>
        )}

        {courseData && (
          <div className="text-center mt-6">
            <button 
              onClick={handleViewCourse}
              className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
            >
              <span>View Generated Course</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg text-center w-full max-w-2xl mx-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Your Score</h2>
            <p className="text-lg md:text-xl mb-4">
              {score}/{results.length}
            </p>
            <div className="text-left max-h-[50vh] overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="font-semibold text-sm md:text-base">{result.question}</p>
                  <p className={`text-xs md:text-sm ${result.isCorrect ? "text-green-500" : "text-red-500"}`}>
                    Your Answer: {result.userAnswer}
                  </p>
                  <p className="text-xs md:text-sm text-blue-500">
                    Correct Answer: {result.correctAnswer}
                  </p>
                  <p className="text-xs md:text-sm text-gray-700">
                    Explanation: {result.explanation}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Close
              </button>
              <button
                onClick={() => (setShowModal(false),setShowPerfModal(true))}
                className="bg-amber-700 text-white p-2 rounded"
              >
                Performance Metrics
              </button>
              <button
                onClick={()=>(setShowModal(false),setShowUnitModal(true))}
                className="bg-emerald-500 text-white p-2 rounded"
              >
                Generate Course
              </button>
            </div>
          </div>
        </div>
      )}

      {showPerfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto py-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-6xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Performance Analysis</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold text-blue-800">Quiz</h3>
                <p className="text-gray-700 mt-2">{courseTitle}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold text-green-800">Score</h3>
                <p className="text-gray-700 mt-2">{score}/{results.length}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold text-yellow-800">Time</h3>
                 <p className="text-gray-700 mt-2">{quizTimeTaken} seconds</p>
                </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold text-purple-800">Level</h3>
                <p className="text-gray-700 mt-2">{level}</p>
              </div>
            </div>

            {/* Recommended Courses Section */}
            <div className="mt-8">
              {courseRecom ? (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Recommended Courses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto p-4">
                    {courseRecom.recommendations?.map((course, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                      >
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">
                          {course.subject}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          Focus Area: <span className="text-gray-800">{course.focus_area}</span>
                        </p>
                        <p className="text-gray-600 mb-4">
                          Units: <span className="text-gray-800">{course.units}</span>
                        </p>
                        <button
                          onClick={() => handleGenerateCourse(course)}
                          className="bg-emerald-500 w-full text-white p-3 rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <QuizLoadingAnimation progress={progress} />
                              <span className="ml-2">Generating Course...</span>
                            </div>
                          ) : (
                            "Generate Course"
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => {
                  setShowPerfModal(false);
                  setShowModal(true);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                Back to Results
              </button>
              
              {courseData && (
                <button 
                  onClick={handleViewCourse} 
                  className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-all duration-300"
                >
                  View Generated Course
                </button>
              )}
              
              <button
                onClick={handleGenerateRecom}
                className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-300"
              >
                Recommended Courses
              </button>
            </div>
          </div>
        </div>
      )}


{showUnitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h2 className="text-xl font-serif mb-5">Generate a Course</h2>
              
              <input 
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                type="number"
                placeholder="Enter the number of units you want to generate"
                className="border w-full p-2 rounded mb-4"
              />
              <input
                value={formData.focus_area}
                onChange={(e) => setFormData({...formData, focus_area: e.target.value})}
                type="text"
                placeholder="Enter the focus area of the course"
                className="border w-full p-2 rounded mb-4"
              />
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowUnitModal(false)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all"
                >
                  Close
                </button>
                
                <button
                  onClick={handleGenerateCourse}
                  className="bg-emerald-500 text-white p-2 rounded hover:bg-emerald-600 transition-all"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <div className="flex flex-col items-center">
                        <span>Generating Course</span>
                        <div className="w-full bg-emerald-300 rounded-full h-2 mt-1">
                          <div 
                            className="bg-white h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{progress}%</span>
                      </div>
                    </div>
                  ) : (
                    "GENERATING"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AICuratedMCQ;
