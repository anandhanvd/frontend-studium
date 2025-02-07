// src/pages/GeneratedCoursePage.jsx
import { useState, useEffect } from 'react';
import React from 'react';
import tick from '../../assets/tick.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowCircleDown, FaArrowCircleUp, FaArrowRight, FaArrowDown, FaTicketAlt,FaChevronDown,FaChevronUp, FaArrowLeft  } from 'react-icons/fa';
import StudentHeader from '../../components/StudentHeader';
import Chatbot from '../../components/Chatbot';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import QuizLoadingAnimation from '../../components/QuizLoadingAnimation';
import FormattedContent from '../../components/FormattedContent';


const GeneratedCoursePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const courseData = location.state?.courseData;
const [unitCompletion, setUnitCompletion] = useState({});
const [openResources, setOpenResources] = useState({});
  const [openAssignment, setOpenAssignment] = useState({});
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
const [domainData, setDomainData] = useState({});
const [courseSaved, setCourseSaved] = useState(false);
const user = JSON.parse(localStorage.getItem("user"));
const userId = user._id;
const [progress, setProgress] = useState(0);
const [relatedDocs, setRelatedDocs] = useState([]);

  const calculateRelevance = (doc, courseTitle, unitTitle, currentTopic) => {
    // Early return if the document is not from a relevant domain
    const relevantDomains = ['biology', 'human heart', 'human anatomy', 'anatomy', 'physiology', 'human anatomy and physiology'];
    if (!relevantDomains.some(domain => 
      doc.domainName?.toLowerCase().includes(domain))) {
      return -10; // Immediately disqualify irrelevant domains
    }

    let score = 0;
    const docDomain = doc.domainName?.toLowerCase() || '';
    const currentContent = currentTopic?.content?.toLowerCase() || '';
    const topicTitle = currentTopic?.topic?.toLowerCase() || '';
    
    // Exact domain matches
    if (docDomain === 'human heart' && topicTitle.includes('heart')) {
      score += 30;
    }
    if (docDomain === 'human anatomy and physiology' && 
        (topicTitle.includes('anatomy') || topicTitle.includes('physiology'))) {
      score += 25;
    }
    if (docDomain === 'biology' && courseTitle.toLowerCase().includes('biology')) {
      score += 20;
    }

    // Content-based matching
    const contentKeywords = [
      'heart', 'blood', 'circulation', 'cardiac', 'vessel', 'artery', 'vein',
      'anatomy', 'physiology', 'organ', 'tissue', 'cell', 'system'
    ];

    contentKeywords.forEach(keyword => {
      if (currentContent.includes(keyword) && docDomain.includes(keyword)) {
        score += 5;
      }
      if (topicTitle.includes(keyword) && docDomain.includes(keyword)) {
        score += 3;
      }
    });

    return score;
  };

  const getDomains = async () => {
    try {
      const response = await axios.get("https://aistudiumb-9jub.onrender.com/domains/all");
      
      if (!response.data.domains || !courseData || !courseData.units) {
        console.error("Missing required data for recommendations");
        return;
      }

      // Get current unit and topic
      const currentUnit = courseData.units[currentTopicIndex];
      const currentTopic = currentUnit?.detailedContent?.topicContents?.[currentTopicIndex];
      
      console.log("Current Context:", {
        courseTitle: courseData.courseTitle,
        unitTitle: currentUnit?.unitTitle,
        topicTitle: currentTopic?.topic,
        content: currentTopic?.content
      });
      
      // Flatten and prepare documents with strict domain filtering
      const flattenedDocs = response.data.domains
        .filter(domain => {
          const domainName = domain.domainName.toLowerCase();
          return domainName.includes('biology') || 
                 domainName.includes('heart') || 
                 domainName.includes('anatomy') || 
                 domainName.includes('physiology');
        })
        .reduce((acc, domain) => {
          const docsWithDomain = domain.documents.map(doc => ({
            document: doc,
            domainName: domain.domainName,
            fileName: doc.split('/').pop(),
            originalDomain: domain
          }));
          return [...acc, ...docsWithDomain];
        }, []);
      
      // Score and filter documents
      const scoredDocs = flattenedDocs
        .map(doc => ({
          ...doc,
          relevanceScore: calculateRelevance(
            doc, 
            courseData.courseTitle, 
            currentUnit?.unitTitle,
            currentTopic
          )
        }))
        .filter(doc => doc.relevanceScore > 0) // Only keep positively scored docs
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 3); // Limit to top 3 most relevant docs

      console.log("Recommended Documents:", scoredDocs);
      setRelatedDocs(scoredDocs);
      
    } catch (error) {
      console.error("Error fetching domains:", error);
    }
  };
  
  const handleSaveCourse = async () => {
    const postUnits = courseData.units
    const newcourseData = {
      userId: userId,
      courseTitle: courseData.courseTitle,
      units:postUnits
    }
    console.log("POSTING COURSE DATA",newcourseData)
    try {
      // Make a POST request to the backend
      const response = await axios.post("https://aistudiumb-9jub.onrender.com/gencourse/add", newcourseData);
      
      // Handle success
      toast.success("Course saved successfully:");
      setCourseSaved(true)
      
    } catch (error) {
      
      toast.warning("Failed to save quiz result. Please try again.");
    }
  };

  useEffect(() => {
    if (courseData?.units?.[currentTopicIndex]?.detailedContent?.topicContents) {
      getDomains();
    }
  }, [courseData, currentTopicIndex]);


  const allUnitsCompleted =
    Object.keys(unitCompletion).length === courseData.units.length &&
    Object.values(unitCompletion).every((completed) => completed);

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

  const [formData, setFormData] = useState({
  
      subject:courseData.courseTitle,
      focus_area: "",
      difficulty: "easy",
      units: 1
  
    });

  const fetchQuiz = async (index) => {
    const formData = {
      subject: courseData.courseTitle,
      focus_area: courseData.units[index].unitTitle,
      difficulty: "easy",
      units: 1
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "https://fullcoursegen-cvil.onrender.com/generate-question",
        formData
      );
      setQuizData(response.data.units[0].assessment.unitAssessment);
      console.log("Quiz Data: ", response.data);
      setCourseTitle(response.data.courseTitle);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching quiz data:", error);
    }
  };

  const fetchMasterQuiz = async () => {
    const formData = {
      subject: courseData.courseTitle,
      focus_area: courseData.courseTitle,
      difficulty: "easy",
      units: 1
    }

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

const [openUnits, setOpenUnits] = useState({});
  if (!courseData) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold">No Course Data Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[1000px] mx-auto ">
  <StudentHeader />
  <Chatbot/>
  <ToastContainer/>
  <div className="container py-10 px-6">
    <h1 className="text-4xl mt-24 font-bold text-center text-gray-800">
      {courseData.courseTitle}
    </h1>
    <div className="mt-8">
      {courseData.units.map((unit, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all duration-300"
        >
          <div
            onClick={() => !unitCompletion[index] && toggleUnit(index)}
            className={`flex items-center justify-between cursor-pointer ${
              unitCompletion[index] ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-700">
              Unit {index + 1}: {unit.unitTitle}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{unit.estimatedDuration}</span>
              {openUnits[index] ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </div>
          </div>

          {openUnits[index] && (
            <div className="mt-4 space-y-4">
              {/* Video Section */}
              <div className="relative h-96 bg-black rounded-lg overflow-hidden">
                {unit.youtube_video_url ? (
                  <iframe
                    src={unit.youtube_video_url.replace("watch?v=", "embed/")}
                    title="YouTube Video Player"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <p className="text-white text-center py-10">No video available</p>
                )}
              </div>

              {/* Resources Section */}
              <div>
                <h3
                  onClick={() => toggleResourse(index)}
                  className="font-medium cursor-pointer text-blue-600 hover:underline"
                >
                  {openResources[index] ? "Hide Resources" : "Show Resources"}
                </h3>
                {openResources[index] && (
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {unit.resources?.map((resource, idx) => (
                      <li key={idx}>
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(
                            resource
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {resource}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Topics Section */}
<div className="bg-white rounded-lg mt-6">
  <h3
    onClick={() => toggleAssignment(index)}
    className="font-medium cursor-pointer text-blue-600 hover:underline mb-4"
  >
    {openAssignment[index] ? (<div className='flex gap-2'>Hide Topics<FaArrowCircleUp className='my-auto'/></div>) : (<div className='flex gap-2'>Show Topics<FaArrowCircleDown className='my-auto'/></div>)}
  </h3>
  {openAssignment[index] && (
    <div className="relative flex flex-col items-center space-y-4">
      {/* Navigation Arrows */}
      {currentTopicIndex > 0 && (
        <button
          className="absolute shadow-md shadow-gray-500 left-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
          onClick={() => setCurrentTopicIndex(currentTopicIndex - 1)}
        >
          <FaArrowLeft />
        </button>
      )}

      <div
        className="bg-gray-100 p-6 w-full rounded-lg shadow transition-transform duration-300"
        key={unit.detailedContent.topicContents[currentTopicIndex].topic}
      >
        <h4 className="text-xl font-semibold text-gray-800 mb-2">
          {unit.detailedContent.topicContents[currentTopicIndex].topic}
        </h4>
        <div className="text-gray-600">
          <FormattedContent content={unit.detailedContent.topicContents[currentTopicIndex].content} />
        </div>
        {/* Examples and Exercises */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Examples */}
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h5 className="text-lg font-bold mb-2">Examples:</h5>
            <ul className="list-disc ml-4 text-gray-700">
              {unit.detailedContent.topicContents[currentTopicIndex].examples.map(
                (example, idx) => (
                  <li key={idx} className="text-sm">
                    {example}
                  </li>
                )
              )}
            </ul>
          </div>
          {/* Exercises */}
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h5 className="text-lg font-bold mb-2">Exercises:</h5>
            <ul className="list-disc ml-4 text-gray-700">
              {unit.detailedContent.topicContents[currentTopicIndex].exercises.map(
                (exercise, idx) => (
                  <li key={idx} className="text-sm">
                    {exercise}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
        <div className="justify-self-center">
        <div className="text-center mt-5 w-fit bg-gray-100 p-6 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Related Documents</h1>
          {relatedDocs.length > 0 ? (
            <div className="text-left">
              <ul className="space-y-3">
                {relatedDocs.map((doc, index) => (
                  <li key={index} className="border-b border-gray-200 pb-2">
                    <a
                      href={doc.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      {doc.fileName || `Document ${index + 1}`}
                    </a>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="bg-blue-100 px-2 py-1 rounded mr-2">
                        {doc.domainName}
                      </span>
                      <span className="bg-green-100 px-2 py-1 rounded">
                        {doc.subdomain}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-600">No related documents found</p>
          )}
        </div>

        </div>
        
        <p className='text-center mt-2 font-thin'>Feeling Confident about the topic?</p>
        <div className='flex gap-5 justify-center my-4'>
        <button className="bg-sky-300 p-2 rounded-lg" onClick={()=>fetchQuiz(index)}> {loading ? (<> Generating </>) : (<> Generate a Quiz </>)} </button>
        {quizData.length > 0 && (
      <button className="bg-sky-600 text-white p-2 rounded-lg" onClick={handleQuizRedirect}> Attempt Quiz</button>
    )}
        </div>
      </div>

      {/* Right Arrow */}
      {currentTopicIndex < unit.detailedContent.topicContents.length - 1 && (
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full  shadow-md shadow-gray-500  hover:bg-blue-600 transition"
          onClick={() => setCurrentTopicIndex(currentTopicIndex + 1)}
        >
          <FaArrowRight/>
        </button>
      )}

      {/* Progress Indicator */}
      <div className="flex space-x-2 mt-4">
        {unit.detailedContent.topicContents.map((_, idx) => (
          <span
            key={idx}
            className={`h-3 w-3 rounded-full ${
              idx === currentTopicIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></span>
        ))}
        
      </div>
      
      
    </div>
    
  )}
</div>


              {/* Completion Button */}
              <div className="text-center">
                <button
                  onClick={() => handleCheckboxChange(index)}
                  className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-700"
                >
                  Mark as Completed
                </button>
              </div>
              
            </div>
          )}
        </div>
      ))}
    </div>
    {allUnitsCompleted && (
    <div className='text-center'>
    <button
  onClick={handleSaveCourse}
  disabled={courseSaved} // Disable the button if the course is saved
  className={`p-2 rounded-lg mx-5 text-white transition-all duration-300 
    ${courseSaved ? "bg-green-500 scale-105 cursor-not-allowed" : "bg-orange-400 hover:bg-orange-600"}`}
>
  {courseSaved ? "Saved" : "Save Course"}
</button>
<button onClick={()=>fetchMasterQuiz()} className='bg-green-200 hover:bg-green-400 transition-all duration-300 p-2 rounded-lg'> 
  {loading ? (<QuizLoadingAnimation progress={progress} />) : (<> Generate Master Quiz </>)} 
</button>
    </div>
    )}
    {quizData.length > 0 && (
      <button className="bg-sky-600 text-white p-2 rounded-lg" onClick={handleQuizRedirect}> Attempt Quiz</button>
    )}
  </div>
</div>

  );
};

export default GeneratedCoursePage;
