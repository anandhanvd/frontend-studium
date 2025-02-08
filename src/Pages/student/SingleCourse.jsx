import React, { useEffect, useState } from "react";
import StudentHeader from "../../components/StudentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FilePreview from '../admin/FilePreview';

const SingleCourse = () => {
  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("userSelectedCourse"));
  const [courseData, setCourseData] = useState(null);
  const [domaindata, setDomainData] = useState("");
  const [courseName, setCourseName] = useState("");
  const [completedSections, setCompletedSections] = useState({});
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleQuizSelection = (quiz) => {
    localStorage.setItem("userQuiz", JSON.stringify(quiz._id));
    navigate("/singleQuiz");
  };

  const fetchDomains = async (domainName) => {
    try {
      const data = await axios.post(
        "https://aistudiumb-9jub.onrender.com/domains/search",
        { domainName: courseName }
      );
      setDomainData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  // Fetch course data
  const getSingleCourse = async () => {
    try {
      const { data } = await axios.post(
        "https://aistudiumb-9jub.onrender.com/course/singleCourse",
        { courseId: id }
      );
      setCourseData(data?.course);
      setCourseName(data.course.courseName)
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  // Calculate and update progress
  const updateProgress = () => {
    // Get all sections that need to be completed
    const sections = ['content', 'videos', 'youtubeVideos', 'quiz'];
    const totalSections = sections.length;
    
    // Count completed sections
    const completedCount = sections.reduce((count, section) => {
      return completedSections[section] ? count + 1 : count;
    }, 0);

    // Calculate percentage
    const progress = Math.floor((completedCount / totalSections) * 100);

    // Save progress data
    const progressData = {
      courseId: id,
      completed: progress,
      completedSections,
      lastUpdated: Date.now()
    };

    // Store in localStorage
    localStorage.setItem(`enrolled-course-${id}-progress`, JSON.stringify(progressData));

    // Update the course completion in the enrolled courses list
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const updatedCourses = enrolledCourses.map(course => {
      if (course.courseId === id) {
        return { ...course, completed: progress };
      }
      return course;
    });
    localStorage.setItem('enrolledCourses', JSON.stringify(updatedCourses));
  };

  const handleMarkComplete = (section) => {
    setCompletedSections(prev => ({
      ...prev,
      [section]: true
    }));
    updateProgress();
  };

  // Load saved progress from localStorage
  useEffect(() => {
    if (id) {
      const savedProgress = localStorage.getItem(`enrolled-course-${id}-progress`);
      if (savedProgress) {
        const { completedSections: saved } = JSON.parse(savedProgress);
        setCompletedSections(saved || {});
      }
    }
  }, [id]);

  useEffect(() => {
    getSingleCourse();
    
  }, []);

  // Add this function to handle document preview
  const handlePreview = (url) => {
    setSelectedDocument(url);
  };

  // Add this function to close preview
  const closePreview = () => {
    setSelectedDocument(null);
  };

  // Add the preview modal component
  const renderDocumentPreview = () => {
    if (!selectedDocument) return null;

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-3/4 max-w-4xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Document Preview</h3>
            <button
              onClick={closePreview}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <FilePreview fileUrl={selectedDocument} />
        </div>
      </div>
    );
  };

  if (!courseData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <StudentHeader />
      {/* Header Section */}
      <div
        className="relative w-full h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${courseData.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{courseData.courseName}</h1>
            <p className="text-lg">{courseData.description}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto p-8 mt-8">
        {/* Course Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-gray-800">Content</h2>
            <button
              onClick={() => handleMarkComplete('content')}
              disabled={completedSections['content']}
              className={`px-4 py-2 rounded-lg ${
                completedSections['content']
                  ? 'bg-green-200 text-green-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {completedSections['content'] ? 'Completed ✓' : 'Mark as Complete'}
            </button>
          </div>
          <p className="text-gray-600">{courseData.content}</p>
        </div>

        {/* Video Lectures */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-gray-800">Uploaded Lectures</h2>
            <button
              onClick={() => handleMarkComplete('videos')}
              disabled={completedSections['videos']}
              className={`px-4 py-2 rounded-lg ${
                completedSections['videos']
                  ? 'bg-green-200 text-green-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {completedSections['videos'] ? 'Completed ✓' : 'Mark as Complete'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData.videos?.map((video, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-lg shadow p-4 relative"
              >
                <video 
                  src={video} 
                  controls 
                  className="w-full rounded-lg"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
                <p className="mt-2 text-sm font-medium text-gray-700">
                  Video {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* YouTube Lectures */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-gray-800">Youtube Lectures</h2>
            <button
              onClick={() => handleMarkComplete('youtube')}
              disabled={completedSections['youtube']}
              className={`px-4 py-2 rounded-lg ${
                completedSections['youtube']
                  ? 'bg-green-200 text-green-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {completedSections['youtube'] ? 'Completed ✓' : 'Mark as Complete'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData.videoLectures.map((video, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-lg shadow p-4 relative"
              >
                <iframe
                  className="w-full rounded-lg"
                  height="200"
                  src={video.replace("watch?v=", "embed/")}
                  title={`Video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <p className="absolute bottom-2 left-2 text-sm font-medium text-gray-700">
                  Video {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Course Notes */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-gray-800">Course Notes</h2>
            <button
              onClick={() => handleMarkComplete('notes')}
              disabled={completedSections['notes']}
              className={`px-4 py-2 rounded-lg ${
                completedSections['notes']
                  ? 'bg-green-200 text-green-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {completedSections['notes'] ? 'Completed ✓' : 'Mark as Complete'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseData.notes.map((note, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <p className="text-gray-600 mb-2">Document {index + 1}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePreview(note)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    Preview
                  </button>
                  <a
                    href={note}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-gray-800">Course Quiz</h2>
            <button
              onClick={() => handleMarkComplete('quiz')}
              disabled={completedSections['quiz']}
              className={`px-4 py-2 rounded-lg ${
                completedSections['quiz']
                  ? 'bg-green-200 text-green-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {completedSections['quiz'] ? 'Completed ✓' : 'Mark as Complete'}
            </button>
          </div>
          {courseData.quizes && courseData.quizes.length > 0 ? (
            <div className="space-y-4">
              {courseData.quizes.map((quiz, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">{quiz.quizName}</h3>
                  <button
                    onClick={() => handleQuizSelection(quiz)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Take Quiz
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No quizzes available for this course.</p>
          )}
        </div>
        <div className="bg-white mt-10 rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Recommended Notes</h2>
          <ul className="list-disc list-inside text-gray-600">
            {domaindata.notes?.map((note, index) => (
              <li key={index} className="mb-2">
                <a
                  href={note}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Notes {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Render the preview modal */}
      {renderDocumentPreview()}
    </>
  );
};

export default SingleCourse;
