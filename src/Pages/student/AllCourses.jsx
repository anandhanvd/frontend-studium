import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentHeader from "../../components/StudentHeader";
import { useNavigate } from "react-router-dom";
import { FaPlayCircle, FaTrashAlt, FaCheckCircle } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { PiCarProfile, PiFileRsDuotone, PiPerson } from "react-icons/pi";
import { IoEllipsisHorizontalCircleOutline } from "react-icons/io5";

const AllCourses = () => {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const handleViewCourse = () => {
    navigate('/generated-course', { state: { courseData } });
  };
  
  const [chatStep, setChatStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [chatHistory, setChatHistory] = useState([
      { sender: "bot", message: "Hello! Let's create your quiz. What subject should it be about?" },
    ]);

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
  
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://fullcoursegen-cvil.onrender.com/generate-question",
          formData
        );
        setQuizData(response.data.units[0].assessment.unitAssessment);
        console.log("Quiz Data : ", response.data)
        setCourseTitle(response.data.courseTitle)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    const handleQuizRedirect = () => {
      navigate('/aiMCQ', { state: { quizData, courseTitle, formData } });
    }


  const [formData, setFormData] = useState({

    subject:  "",
    focus_area: "",
    difficulty: "easy",
    units: 1

  });
  const questions = [
    "What is the subject for your quiz?",
    "What difficulty level do you prefer? (easy, medium, hard)",
    "What is the focus area for the quiz?",
  ];

  useEffect(() => {
    
      // Display the first question when the component mounts
      setChatMessages([{ type: "bot", message: questions[0] }]);
      
    }, []);


  


  const getCourses = async () => {
    try {
      const { data } = await axios.get(
        "https://aistudiumb.onrender.com/course/allCourses"
      );
      setCourses(data.courses); // Assuming 'data.courses' is the array of courses
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnroll = async (id) => {
    try {
      const { data } = await axios.post(
        "https://aistudiumb.onrender.com/user/enrollCourse",
        {
          courseId: id,
          userId: userId,
        }
      );
      navigate("/enrolled");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      <StudentHeader />
      <div className="container mx-auto p-6 mt-24">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-indigo-600">
          All Courses
        </h1>
        <button onClick={()=> navigate("/enrolled")} className="bg-indigo-400 text-white p-2 absolute end-0 mr-[600px] -translate-y-16  hover:bg-indigo-600 transition-all duration-300 rounded-lg shadow-xl"> Your Enrolled Courses</button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.length > 0 ? (
            courses?.map((course) => (
              <div
                key={course._id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl h-[530px] overflow-auto transform transition-all  hover:scale-105 duration-300"
              >
                <img
                  src={course?.image}
                  alt={course.courseName}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {course.courseName}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                <div className="text-gray-500 mb-4">
                  <p>
                    <strong>Notes:</strong> {course?.notes?.length}
                  </p>
                  <p>
                    <strong>Lectures:</strong> {course?.videoLectures?.length}
                  </p>
                  <p>
                    <strong>Quizzes:</strong> {course?.quizes?.length}
                  </p>
                </div>
                <button
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors w-full flex items-center justify-center"
                  onClick={() => handleEnroll(course?._id)}
                >
                  <FaPlayCircle className="mr-2" /> Enroll in this Course
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-600">No courses available.</p>
          )}
        </div>
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

          {loading ? (<><p className="text-black text-center mt-4">Generating quiz...</p></>):(<></>)}
        </div>
        </div>
        {quizData.length > 0 && (
        <div className="justify-self-center mb-20 ">
        <button onClick={handleQuizRedirect} className="bg-emerald-200 p-2 rounded-lg shadow-md hover:shadow-lg shadow-gray-500 hover:shadow-gray-500 hover:bg-emerald-600 transition-all duration-300 hover:text-white">Attempt Quiz</button> 
        </div>
        )}
        
        
      </div>
    </>
  );
};

export default AllCourses;
