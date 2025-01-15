import React, { useState } from "react";
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
  const [timeRemaining, setTimeRemaining] = useState(0); // 15 minutes timer (900 seconds)
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
        "https://fullcoursegen-cvil.onrender.com/generate-question",
        formData
      );
      setQuizData(response.data.units[0].assessment.unitAssessment);
      console.log("Quiz Data : ", response.data)
      
      setLoading(false);

      // Start the timer when the quiz is fetched
    setIsTimerRunning(true);
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timerInterval);
          setIsTimerRunning(false);
          handleSubmit(); // Auto-submit the quiz when time is up
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  const handleGenerateRecom = async () => {
    const recomData = {
      student_level:level,course: courseTitle
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://fullcoursegen-ibzp.onrender.com/course-recommendation",
        recomData
      );
      setCourseRecom(response.data);
      console.log("RECOMMENDATION DATA : ",response.data)
    } catch (error) {
      console.log("Error",error)
    } finally {
      setLoading(false);
    }
  };

  const questions = [
    "What is the subject for your quiz?",
    "What difficulty level do you prefer? (easy, medium, hard)",
    "What is the focus area for the quiz?",
  ];

  const handleGenerateCourse = async () => {
    console.log("Form Data : ", formData)
    setLoading(true);
    try {
      const response = await axios.post(
        "https://fullcoursegen.onrender.com/generate-course",
        formData
      );
      setCourseData(response.data);
      console.log(response.data)
    } catch (error) {
      console.log("Error",error)
    } finally {
      setLoading(false);
    }
  };


  const fetchLevel = async () => {
    try {
      
      console.log("Input for Level Prediction : ", levelData)
      const response = await axios.post(
        "https://fullcoursegen-cvil.onrender.com/predict-level", levelData
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
    let correctAnswers = 0;
    const detailedResults = [];
    
    quizData.forEach((topic) => {
      topic.questions.forEach((question) => {
        const isCorrect =
          userAnswers[question.questionId] === question.correctAnswer;
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
    const timeTaken = 900 - timeRemaining;
    
    const resultData = {
      title: initialcourseTitle, // Replace with actual quiz title
      score: correctAnswers,                 // Replace with the user's score
      timeTaken: timeTaken,// Replace with the time taken in seconds
      userId: user._id, // Replace with logged-in user's ID
    };
    console.log("Details : ", resultData)
    
    postQuizResult(resultData);
    setScore(correctAnswers);
    setQuizTimeTaken(timeTaken);
    fetchLevel(correctAnswers,timeTaken);
    setResults(detailedResults);
    setShowModal(true);
  };

  const postQuizResult = async (resultsData) => {
    try {
      // Make a POST request to the backend
      const response = await axios.post("https://aistudiumb.onrender.com/api/results/save", resultsData);
      
      // Handle success
      toast.success("Result saved successfully:");
      
    } catch (error) {
      
      toast.warning("Failed to save quiz result. Please try again.");
    }
  };

  return (
    <>
      <StudentHeader />
      <ToastContainer/>
      <div className="p-8 mt-32 rounded-lg w-full justify-self-center ">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-8">
          AI Chatbot Quiz Creator
        </h2>

        <div className="bg-sky-200 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <div className="chat-box h-64 overflow-y-auto  bg-gray-100 p-8 rounded-lg mb-4">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded ${
                  chat.sender === "user" ? "bg-blue-200 w-fit justify-self-end text-right" : "bg-gray-300 w-fit"
                }`}
              >
                {chat.message}
              </div>
            ))}
          </div>

          {quizData.length === 0 && (
            <div className="flex items-center">
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
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                disabled={loading}
              >
                Send
              </button>
            </div>
          )}

          {loading && <p className="text-black text-center mt-4">Generating quiz...</p>}
        </div>

        {quizData.length > 0 && (
        <div className="bg-gray-100 w-fit justify-self-center mt-10 shadow-lg rounded-lg p-6">
          {/* Timer */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 text-lg font-bold text-blue-500">
              <FaClock className="text-2xl" />
              <span>
                Time Remaining:{" "}
                <span
                  className={`${
                    timeRemaining < 30 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {Math.floor(timeRemaining / 60)}:
                  {(timeRemaining % 60).toString().padStart(2, "0")}
                </span>
              </span>
            </div>
            <div className="text-blue-600 font-semibold">
              Total Questions: {quizData.reduce((acc, topic) => acc + topic.questions.length, 0)}
            </div>
          </div>

          {/* Quiz Questions */}
          {quizData.map((topic, topicIndex) => (
            <div key={topicIndex} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 bg-blue-100 p-3 rounded-lg shadow">
                {topic.topic}
              </h3>
              {topic.questions.map((question) => (
                <div
                  key={question.questionId}
                  className="mb-6 bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300"
                >
                  <p className="text-lg font-medium text-gray-700 mb-4">
                    {question.question}
                  </p>
                  {question.options.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-2 mb-3 cursor-pointer bg-white p-2 rounded-lg border hover:border-blue-500 shadow hover:shadow-lg transition-all duration-300"
                    >
                      <input
                        type="radio"
                        name={question.questionId}
                        value={option}
                        onChange={() =>
                          handleOptionChange(question.questionId, option)
                        }
                        className="accent-blue-500"
                      />
                      <span className="text-gray-800">{option}</span>
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
              className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-green-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <FaCheckCircle className="text-xl" />
              <span>Submit Quiz</span>
            </button>
          </div>
        </div>
      )}


        { showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Your Score</h2>
              <p className="text-xl mb-4">
                {score}/{results.length}
              </p>
              <div className="text-left max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold">{result.question}</p>
                    <p
                      className={`text-sm ${
                        result.isCorrect ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      Your Answer: {result.userAnswer}
                    </p>
                    <p className="text-sm text-blue-500">
                      Correct Answer: {result.correctAnswer}
                    </p>
                    <p className="text-sm text-gray-700">
                      Explanation: {result.explanation}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-500 text-white p-2 rounded mt-4"
              >
                Close
              </button>
              <button
                onClick={() => (setShowModal(false),setShowPerfModal(true))}
                className="bg-amber-700 ml-10 text-white p-2 rounded mt-4"
              >
                Your Performance Metrics
              </button>
              <button
                onClick={()=>(setShowModal(false),setShowUnitModal(true))}
                className="bg-emerald-500 ml-10 text-white p-2 rounded mt-4"
              >
               Generate a Course
              </button>

              {courseData ? (<><button onClick={handleViewCourse} className="bg-sky-500 ml-10 text-white p-2 rounded mt-4">VIEW GENERTED COURSE</button></>):(<></>)}
              
            </div>
            
          </div>
        )}

        {showPerfModal && (
          <>
          <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white mt-16 p-6 rounded shadow-lg text-center">
              <h2 className="text-xl font-serif mb-5"> PERFOMANCE MODAL </h2>
              <h2 className="text-lg font-bold">Quiz : {courseTitle} </h2>
              <h2 className="text-lg font-bold">Your Score : {score}/{results.length} </h2>
              <p className="text-lg mb-4 font-bold">Time Taken : 15 seconds</p>
              <p className="text-lg mb-4 font-bold">Your Level : {level}</p>

              <div>
                {courseRecom ? (<>
                  <div className="p-6">
  <h2 className="text-2xl font-bold mb-4 text-gray-800">Recommended Courses</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
    {courseRecom.recommendations?.map((course, index) => (
      <div
        key={index}
        className="bg-white w-64 shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow"
      >
        <h3 className="text-lg font-semibold text-gray-700">
          {course.subject}
        </h3>
        <p className="text-gray-600 mt-2">
          Focus Area: <span className="text-gray-800">{course.focus_area}</span>
        </p>
        <p className="text-gray-600 mt-2">
          Units: <span className="text-gray-800">{course.units}</span>
        </p>
        <button
                onClick={()=>(handleGenerateCourse())}
                className="bg-emerald-500 ml-10 text-white p-2 rounded mt-4"
              >
                Generate Course
              </button>
      </div>
    ))}
  </div>
</div>

                </>):(<>
                
                </>)}
              </div>
              
              <button
                onClick={() => setShowPerfModal(false)}
                className="bg-blue-500 text-white p-2 rounded mt-4"
              >
                Close
              </button>
              {/* <button
                onClick={()=>(setShowPerfModal(false),setShowUnitModal(true))}
                className="bg-emerald-500 ml-10 text-white p-2 rounded mt-4"
              >
                Generate a Course of Quiz
              </button> */}
              {courseData ? (<><button onClick={handleViewCourse} className="bg-sky-500 ml-10 text-white p-2 rounded mt-4">VIEW GENERTED COURSE</button></>):(<><button disabled className="bg-sky-500 ml-10 text-white p-2 rounded mt-4">Generating Course</button></>)}
              
              <button
                onClick={handleGenerateRecom}
                className="bg-emerald-500 ml-10 text-white p-2 rounded mt-4"
              >
                Recommended Courses
              </button>
              
            </div>
          </div>
          </>
        )}


{showUnitModal && (
          <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h2 className="text-xl font-serif mb-5"> Generate a Course </h2>
              
              <input 
              value={formData.unit}
              onChange={(e) => setFormData({...formData,unit:e.target.value})}
              type="number"
              placeholder="Enter the number of units you want to generate"
              className="border w-full p-2 rounded mb-4"

              />
              <input
              value={formData.focus_area}
              onChange={(e) => setFormData({...formData,focus_area:e.target.value})}
              type="text"
              placeholder="Enter the focus area of the course"
              className="border w-full p-2 rounded mb-4"
              />
             
              
              <button
                onClick={() => setShowUnitModal(false)}
                className="bg-blue-500 text-white p-2 rounded mt-4"
              >
                Close
              </button>
              <button
                onClick={()=>handleGenerateCourse()}
                className="bg-emerald-500 ml-10 text-white p-2 rounded mt-4"
              >
                {loading ? (<>GENERATING</>) : (<>Generate</>)}
              </button>
              {courseData ? (<><button onClick={handleViewCourse} className="bg-sky-500 ml-10 text-white p-2 rounded mt-4">VIEW GENERTED COURSE</button></>):(<></>)}
            </div>
          </div>
          </>
        )}
      </div>
    </>
  );
};

export default AICuratedMCQ;
