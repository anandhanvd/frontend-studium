import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { IoReload } from "react-icons/io5";
import FilePreview from './FilePreview'; // Adjust the path as needed
import { toast } from "react-hot-toast";

const Course = () => {
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [fileDetails, setFileDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false); // Modal for course details
  const [courseName, setCourseName] = useState("");
  const [notes, setNotes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [content, setContent] = useState("");
  const [videoLectures, setVideoLectures] = useState([""]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null); // To store the selected course for modal
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState();
  const [domain, setDomain] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [isDomainPopupVisible, setIsDomainPopupVisible] = useState(true); // Control visibility
  const [domainData, setDomainData] = useState({});
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getDomains = async () => {
    try {
      const domainData = await axios.get(
        "https://aistudiumb-9jub.onrender.com/domains/all"
      );
      console.log("Domains fetched:", domainData.data);
      setDomainData(domainData.data);
    } catch (error) {
      console.error("Error fetching domains:", error);
    }
  };
  
  

  // Open/Close Modal for adding a course
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setFileDetails([]);
    setSelectedDocument(null);
  };

  // Open/Close Modal for course details
  const toggleCourseModal = (course) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(!isCourseModalOpen);
  };

  // Add Another Video Lecture Input
  const addLectureInput = () => {
    setVideoLectures([...videoLectures, ""]);
  };

  // Update Lecture Input
  const updateLectureInput = (index, value) => {
    const updatedLectures = [...videoLectures];
    // Convert YouTube URL to embed format
    const convertedUrl = convertToEmbedUrl(value);
    updatedLectures[index] = convertedUrl;
    setVideoLectures(updatedLectures);
  };

  // Add this new function to handle URL conversion
  const convertToEmbedUrl = (url) => {
    try {
      // Handle different YouTube URL formats
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      
      if (match && match[2].length === 11) {
        // Return the embed URL format
        return `https://www.youtube.com/embed/${match[2]}`;
      }
      return url;
    } catch (error) {
      return url;
    }
  };

  const handleImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "vqohpgdn");
    formData.append("cloud_name", "dcigsqglj");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dcigsqglj/image/upload",
        formData
      );
      const imageUrl = response.data.secure_url;
      setImage(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const uploadNotes = async (file) => {
    setShowFileDetails(true);
    setIsAnalyzing(true);

    const fileType = file.name.split('.').pop().toLowerCase();
    const allowedTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx'];

    if (!allowedTypes.includes(fileType)) {
      toast.error('Please upload PDF, DOC, DOCX, PPT, or PPTX files only');
      setIsAnalyzing(false);
      return;
    }

    try {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("upload_preset", "vqohpgdn");
      
      // Use different resource type for PDFs
      if (fileType === 'pdf') {
        cloudinaryFormData.append("resource_type", "auto");
      } else {
        cloudinaryFormData.append("resource_type", "raw");
      }

      // Use the appropriate upload endpoint
      const uploadUrl = fileType === 'pdf' 
        ? "https://api.cloudinary.com/v1_1/dcigsqglj/upload"
        : "https://api.cloudinary.com/v1_1/dcigsqglj/raw/upload";

      const uploadResponse = await axios.post(uploadUrl, cloudinaryFormData);

      // Ensure the URL uses HTTPS
      const secureUrl = uploadResponse.data.secure_url.replace('http://', 'https://');

      try {
        const analysisResponse = await axios.post(
          "https://ml-mvqr.onrender.com/content/detect-domain-from-file",
          {
            file_url: secureUrl,
            file_type: fileType
          }
        );

        setFileDetails(prev => [...prev, {
          fileName: file.name,
          fileUrl: secureUrl,
          fileType: fileType,
          domain: analysisResponse.data.domain || 'Unknown',
          subdomain: analysisResponse.data.subdomain || 'Unknown',
          explanation: analysisResponse.data.explanation || '',
          uploaded: true,
          isEditing: false
        }]);

        setNotes(prev => [...prev, secureUrl]);
        toast.success("File analyzed successfully");
      } catch (analysisError) {
        console.error("Analysis error:", analysisError);
        setFileDetails(prev => [...prev, {
          fileName: file.name,
          fileUrl: secureUrl,
          fileType: fileType,
          domain: 'Unknown',
          subdomain: 'Unknown',
          explanation: '',
          uploaded: true,
          isEditing: true
        }]);

        setNotes(prev => [...prev, secureUrl]);
        toast.warning("Please classify this document manually");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Upload Notes File to Cloudinary
  const uploadVideos = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "vqohpgdn"); // Replace with your Cloudinary preset
    formData.append("resource_type", "raw");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dcigsqglj/auto/upload", // Replace with your Cloudinary endpoint
        formData
      );
      setVideos([...videos, response.data.url]);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const fetchDomain = async (file_url) => {
    try {
      const response = await axios.post(
        "https://ml-mvqr.onrender.com/content/detect-domain-from-file",
        { file_url }
      );
      // Extract subDomain and fileName from the response
      const { subdomain, filename } = response.data;
  
      // Call postDomain to save subDomain and fileName
      await postDomain(subdomain, filename);
    } catch (error) {
      console.error("Error detecting domain from file:", error);
    }
  };

  const postDomain = async (domainName, document) => {
    try {
      await axios.post("https://aistudiumb-9jub.onrender.com/domains/add", {
        domainName,
        document
      });
      alert("Domain added successfully!");
    } catch (error) {
      console.error("Error posting domain:", error);
    }
  };

  const submitCourse = async () => {
    const courseData = {
      courseName,
      notes,
      videos,
      videoLectures,
      image,
      description,
      content
    };
  
    try {
      await axios.post(
        "https://aistudiumb-9jub.onrender.com/course/createCourse",
        courseData
      );
      alert("Course added successfully!");
      fetchDomain(notes[0]);
      toggleModal();
      fetchCourses();

      // Clear all form fields after successful submission
      setCourseName("");
      setDescription("");
      setContent("");
      setImage(null);
      setVideoLectures([""]);
      setNotes([]);
      setFileDetails([]);
      setDomain("");
      setSelectedDocument(null);
      setShowFileDetails(false);
      setIsAnalyzing(false);
      
      toast.success("Course created successfully!");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    }
  };

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(
        "https://aistudiumb-9jub.onrender.com/course/allCourses"
      );
      setCourses(data.courses);
      if (data.courses.length > 0) {
        setCourseName(data.courses[0].courseName); // Safely set courseName
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    getDomains();
  }, []);

  // Delete Course
  const deleteCourse = async (courseId) => {
    try {
      await axios.post(`https://aistudiumb-9jub.onrender.com/course/delete`, {
        courseId,
      });
      alert("Course deleted successfully!");
      fetchCourses(); // Refresh the courses list after deletion
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleQuiz = (courseId) => {
    localStorage.setItem("courseID", JSON.stringify(courseId));
    navigate("/quiz");
  };

  const renderFileDetails = () => {
    if (!fileDetails.length) return null;
    return (
      <div className="mt-4 space-y-2">
        {fileDetails.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <span className="text-sm text-gray-600">{file.name}</span>
            <button
              onClick={() => setSelectedDocument(file.fileUrl)}
              className="text-blue-500 hover:text-blue-600"
            >
              Preview
            </button>
          </div>
        ))}
      </div>
    );
  };

  const updateFileDomain = (index, field, value) => {
    const updatedDetails = [...fileDetails];
    updatedDetails[index][field] = value;
    setFileDetails(updatedDetails);
  };

  const renderDocumentPreview = () => {
    if (!selectedDocument) return null;

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg w-3/4 max-w-3xl p-6 shadow-lg">
          <button
            onClick={() => setSelectedDocument(null)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 mb-4"
          >
            Close Preview
          </button>
          <FilePreview fileUrl={selectedDocument} />
        </div>
      </div>
    );
  };

  const renderSeeMoreModal = () => {
    if (!selectedCourse) return null;

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg w-3/4 max-w-4xl p-6 shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{selectedCourse.courseName}</h2>
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <p className="mb-4">{selectedCourse.description}</p>
          <p className="mb-4">{selectedCourse.content}</p>

          {/* YouTube Videos Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">YouTube Lectures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCourse.videoLectures?.map((video, index) => (
                <div key={index} className="bg-gray-200 rounded-lg shadow p-4 relative">
                  <iframe
                    className="w-full rounded-lg"
                    height="200"
                    src={video.replace("watch?v=", "embed/")}
                    title={`Video ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    Lecture {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Course Notes</h3>
              <div className="space-y-4">
                {selectedCourse.notes?.map((note, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Document {index + 1}</h4>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setSelectedDocument(note)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Preview Document
                      </button>
                      <div className="space-x-4">
                        <a
                          href={note}
                          download
                          className="text-green-500 hover:text-green-700"
                        >
                          Download
                        </a>
                        <a
                          href={note}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Open in new tab
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Course Videos</h3>
              <div className="space-y-4">
                {selectedCourse.videos?.map((video, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <video 
                      src={video} 
                      controls 
                      className="w-full rounded-lg"
                      preload="metadata"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "vqohpgdn");
      formData.append("resource_type", "raw");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dcigsqglj/auto/upload",
          formData
        );
        setNotes([...notes, response.data.url]);
        setFileDetails([...fileDetails, { name: file.name, url: response.data.url }]);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section - Similar to AllCourses.jsx style */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Course Management</h1>
          <p className="text-white/90">Manage and organize your educational content</p>
          <button
            onClick={toggleModal}
            className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-300 flex items-center gap-2 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Course
          </button>
        </div>
      </div>

      {/* Courses Grid - Enhanced version */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative aspect-video">
                  <img
                    src={course.image}
                    alt={course.courseName}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    {course.courseName}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{course.notes.length} Notes</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>{course.videoLectures.length} Lectures</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.quizes.length} Quizzes</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.videos.length} Videos</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCourseModal(course)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleQuiz(course._id)}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Add Quiz
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No courses available. Add your first course!</p>
          </div>
        )}
      </div>

      {/* Domain-wise File Classification */}
      <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Labelled Documents</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Course materials organized by their respective domains for easy access and reference
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {domainData?.domains?.map((dom, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold">
                  Domain: <span className="text-blue-600">{dom.domainName}</span>
                </h2>
              </div>

              <div className="p-6">
                <ul className="space-y-3">
                  {dom.documents.map((doc, docIndex) => (
                    <li key={docIndex} className="group">
                      <button
                        onClick={() => setSelectedDocument(doc)}
                        className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 
                                 flex items-center gap-3 transition-all duration-200"
                      >
                        <svg 
                          className="w-5 h-5 text-gray-400 group-hover:text-blue-500" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                        <span className="text-gray-600 group-hover:text-blue-600 truncate">
                          {doc}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Document Preview Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-3/4 max-w-4xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Document Preview</h3>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <FilePreview fileUrl={selectedDocument} />
            </div>
          </div>
        )}
      </div>

      {/* Modal for adding a course */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create New Course</h2>

            {/* Course Details */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Course Name</label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Enter course name"
              />
            </div>

            {/* Course Image */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Course Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImage(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Course Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 h-32"
                placeholder="Enter course description"
              />
            </div>

            {/* Course Content */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Course Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 h-32"
                placeholder="Enter course content"
              />
            </div>

            {/* Video Lectures */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Video Lectures</label>
              {videoLectures.map((lecture, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <input
                    type="url"
                    value={lecture}
                    onChange={(e) => updateLectureInput(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-3"
                    placeholder="Enter lecture URL"
                  />
                  {index === videoLectures.length - 1 && (
                    <button
                      onClick={addLectureInput}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Add Another
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* File Upload with Analysis and Preview */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Course Materials</label>
              <input
                type="file"
                onChange={(e) => uploadNotes(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg p-3"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
              />
              
              {/* File Analysis Results */}
              {showFileDetails && fileDetails.map((file, index) => (
                <div key={index} className="mt-4 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{file.fileName}</span>
                    <button
                      onClick={() => setSelectedDocument(file.fileUrl)}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Preview
                    </button>
                  </div>
                  
                  {/* Analyzed Domain and Subdomain */}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Analyzed Domain</label>
                      <input
                        type="text"
                        value={file.domain}
                        onChange={(e) => {
                          const updatedFiles = [...fileDetails];
                          updatedFiles[index].domain = e.target.value;
                          setFileDetails(updatedFiles);
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Analyzed Subdomain</label>
                      <input
                        type="text"
                        value={file.subdomain}
                        onChange={(e) => {
                          const updatedFiles = [...fileDetails];
                          updatedFiles[index].subdomain = e.target.value;
                          setFileDetails(updatedFiles);
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                  </div>

                  {/* Analysis Status or Explanation */}
                  {file.explanation && (
                    <p className="text-sm text-gray-600 mt-2">{file.explanation}</p>
                  )}
                </div>
              ))}

              {/* Loading State */}
              {isAnalyzing && (
                <div className="mt-4 text-center text-gray-600">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Analyzing document...
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={toggleModal}
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitCourse}
                className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Create Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for course details */}
      {isCourseModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-3/4 max-w-4xl p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6">{selectedCourse.courseName}</h2>
            
            {/* Course Description */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description:</h3>
              <p className="text-gray-600">{selectedCourse.description}</p>
            </div>

            {/* YouTube Videos Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">YouTube Lectures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCourse.videoLectures?.map((video, index) => (
                  <div key={index} className="bg-gray-200 rounded-lg shadow p-4 relative">
                    <iframe
                      className="w-full rounded-lg"
                      height="200"
                      src={video.replace("watch?v=", "embed/")}
                      title={`Video ${index + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      Lecture {index + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={() => handleQuiz(selectedCourse._id)}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                Add Quiz
              </button>
              <button
                onClick={toggleCourseModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {renderSeeMoreModal()}
    </div>
  );
};

export default Course;
