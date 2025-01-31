import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentHeader from "../../components/StudentHeader";
import { useNavigate } from "react-router-dom";
import { FaPlayCircle, FaTrashAlt, FaCheckCircle, FaBookOpen, FaChalkboardTeacher, FaQuestionCircle, FaPaperPlane } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { PiCarProfile, PiFileRsDuotone, PiPerson } from "react-icons/pi";
import { IoEllipsisHorizontalCircleOutline } from "react-icons/io5";
import QuizLoadingAnimation from '../../components/QuizLoadingAnimation';

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
  
    const [progress, setProgress] = useState(0);

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setProgress(0);
        
        // Start progress animation
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 500);

        const response = await axios.post(
          "https://fullcoursegen-cvil.onrender.com/generate-question",
          formData
        );
        
        // Complete the progress
        clearInterval(progressInterval);
        setProgress(100);
        
        setQuizData(response.data.units[0].assessment.unitAssessment);
        console.log("Quiz Data : ", response.data);
        setCourseTitle(response.data.courseTitle);
        
        setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 500);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setLoading(false);
        setProgress(0);
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
        "https://aistudiumb-9jub.onrender.com/course/allCourses"
      );
      setCourses(data.courses); // Assuming 'data.courses' is the array of courses
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnroll = async (id) => {
    try {
      const { data } = await axios.post(
        "https://aistudiumb-9jub.onrender.com/user/enrollCourse",
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
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Explore Our Courses
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover a world of knowledge with our carefully curated courses designed to help you succeed.
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.length > 0 ? (
            courses?.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={course?.image}
                    alt={course.courseName}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {course.courseName}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
                      <FaBookOpen className="text-blue-600 text-xl mb-1" />
                      <span className="text-sm text-gray-600">{course?.notes?.length} Notes</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                      <FaChalkboardTeacher className="text-purple-600 text-xl mb-1" />
                      <span className="text-sm text-gray-600">{course?.videoLectures?.length} Lectures</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
                      <FaQuestionCircle className="text-green-600 text-xl mb-1" />
                      <span className="text-sm text-gray-600">{course?.quizes?.length} Quizzes</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleEnroll(course?._id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FaPlayCircle className="text-xl" />
                    Enroll Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">No courses available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Chat Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <h2 className="text-xl font-bold text-white text-center">
              AI Quiz Generator
            </h2>
          </div>

          {/* Chat Container */}
          <div className="p-6">
            <div className="chat-box h-[400px] overflow-y-auto bg-gray-100 p-4 rounded-lg">
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
          </div>

          {/* Footer Section */}
          <div className="border-t bg-gray-50 p-4">
            {loading ? (
              <div className="mb-4">
                <QuizLoadingAnimation progress={progress} />
              </div>
            ) : quizData.length > 0 ? (
              <div className="flex justify-center">
                <button
                  onClick={handleQuizRedirect}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Start Quiz
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && userInput.trim()) {
                      e.preventDefault();
                      handleUserMessage();
                    }
                  }}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Type your message..."
                  disabled={loading}
                />
                <button
                  onClick={handleUserMessage}
                  disabled={loading || !userInput.trim()}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCourses;
