import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleUp, FaArrowCircleDown, FaArrowDown, FaArrowUp, FaArrowRight } from "react-icons/fa";
import StudentHeader from '../../components/StudentHeader'
import QuizLoadingAnimation from '../../components/QuizLoadingAnimation';

const AICuratedCourse = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({

    subject:  "",
    focus_area: "",
    difficulty: "easy",
    units: 1

  });

  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [openUnits, setOpenUnits] = useState({});
  const [unitCompletion, setUnitCompletion] = useState({});
  const [openDetailedContent, setOpenDetailedContent] = useState({});
  const [openTopics, setOpenTopics] = useState({});
  const [openResources, setOpenResources] = useState({});
  const [openAssignment, setOpenAssignment] = useState({});
  const [progress, setProgress] = useState(0);

  const handleViewCourse = () => {
    navigate('/generated-course', { state: { courseData } });
  };
  const questions = [
    "What is your subject?",
    "What is your focus area?",
    "What is your difficulty level? (easy, medium, hard)",
    "How many units do you want?",
  ];

  useEffect(() => {
  
    // Display the first question when the component mounts
    setChatMessages([{ type: "bot", message: questions[0] }]);
    
  }, []);

  const toggleUnit = (index) => {
    setOpenUnits((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleTopic = (index) => {
    setOpenTopics((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleAssignment = (index) => {
    setOpenAssignment((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleResourse = (index) => {
    setOpenResources((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleDetailedContent = (unitIndex) => {
    setOpenDetailedContent((prev) => ({
      ...prev,
      [unitIndex]: !prev[unitIndex],
    }));
  };

  const handleCheckboxChange = (index) => {
    setUnitCompletion((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    if (!unitCompletion[index]) {
      setOpenUnits((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleUserResponse = (response) => {
    const updatedFormData = { ...formData };
    if (currentStep === 0) updatedFormData.subject = response;
    if (currentStep === 1) updatedFormData.focus_area = response;
    if (currentStep === 2) updatedFormData.difficulty = response.toLowerCase();
    if (currentStep === 3) updatedFormData.units = parseInt(response, 10);

    setFormData(updatedFormData);

    setChatMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", message: response },
    ]);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", message: questions[currentStep + 1] },
      ]);
    } else {
      submitCourseData(updatedFormData);
    }
  };

  const submitCourseData = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://ml-mvqr.onrender.com/generator/generate-course",
        data
      );
      setCourseData(response.data);
      console.log(response.data)
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", message: "Here is your generated course:" },
      ]);
    } catch (error) {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", message: "Error generating course. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const message = e.target.userMessage.value;
    e.target.userMessage.value = "";

    try {
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

      // Add user message to chat
      setChatMessages([...chatMessages, { type: "user", message }]);

      const response = await axios.post(
        "https://ml-mvqr.onrender.com/course/generate-course",
        { message, currentStep }
      );

      clearInterval(progressInterval);
      setProgress(100);
      
      setCourseData(response.data);
      
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);

    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      setProgress(0);
    }
  };

  const handleClear = () => {
    setChatMessages([{ type: "bot", message: questions[0] }]);
    setCurrentStep(0);
    setFormData({ subject: "", focus_area: "", difficulty: "", units: null });
  };

  const handleGenerateNew = () => {
    setChatMessages([{ type: "bot", message: questions[0] }]);
    setCurrentStep(0);
    setFormData({ subject: "", focus_area: "", difficulty: "", units: null });
  };

  return (
    <div className="bg-gray-50 pb-24 rounded-lg shadow-lg">
      <StudentHeader/>
      <h2 className="text-3xl font-semibold mt-10 text-center text-blue-600 mb-4">
        AI Curated Course Chatbot
      </h2>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="chat-container h-96 overflow-y-auto p-4 border rounded-lg">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 rounded-lg ${
                msg.type === "bot"
                  ? "bg-blue-500 w-fit text-white self-start"
                  : "bg-gray-300 w-fit justify-self-end text-gray-800 self-end"
              }`}
            >
              {msg.message}
            </div>
          ))}

          {loading && <QuizLoadingAnimation progress={progress} />}
        </div>

        {!courseData && (
          <form onSubmit={handleSendMessage} className="mt-4 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              name="userMessage"
              placeholder="Type your response..."
              className="flex-grow p-2 border rounded-lg"
              disabled={loading}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-lg w-full md:w-auto"
                disabled={loading}
              >
                Send
              </button>
              <button
                onClick={handleClear}
                className="bg-red-500 text-white p-2 rounded-lg w-full md:w-auto"
              >
                Clear
              </button>
            </div>
          </form>
        )}

        {courseData && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <button
              onClick={handleViewCourse}
              className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-all duration-300 flex items-center gap-2"
            >
              <span>View Generated Course</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleGenerateNew}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Generate New Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICuratedCourse;