import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleUp, FaArrowCircleDown, FaArrowDown, FaArrowUp, FaArrowRight } from "react-icons/fa";
import StudentHeader from '../../components/StudentHeader'
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
        "https://fullcoursegen.onrender.com/generate-course",
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    const inputField = e.target.elements.userMessage;
    const userMessage = inputField.value.trim();

    if (!userMessage) return;

    handleUserResponse(userMessage);
    inputField.value = "";
  };

  return (
    <div className="bg-gray-50 pb-24 rounded-lg shadow-lg">
    <StudentHeader/>
      <h2 className="text-3xl font-semibold mt-10 text-center text-blue-600 mb-4">
        AI Curated Course Chatbot
      </h2>
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="chat-container h-96 overflow-y-auto p-4 border">
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

{courseData && (
      <div className="text-center mt-4">
        <button
          onClick={handleViewCourse}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg"
        >
          View Generated Course
        </button>
      </div>
    )}
        </div>
        {!courseData && (
          <form onSubmit={handleSendMessage} className="mt-4 flex">
            <input
              type="text"
              name="userMessage"
              placeholder="Type your response..."
              className="flex-grow p-2 border rounded-lg"
              disabled={loading}
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
              disabled={loading}
            >
              Send
            </button>
            <button
            onClick={()=> (setChatMessages([{ type: "bot", message: questions[0] }]),setCurrentStep(0) ,setFormData({subject:"",focus_area:"",difficulty:"",units:null}))}
              className="ml-2 bg-red-500 text-white p-2 rounded-lg"
            >
              Clear
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AICuratedCourse;