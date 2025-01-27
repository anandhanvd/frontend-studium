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
    updatedLectures[index] = value;
    setVideoLectures(updatedLectures);
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
      cloudinaryFormData.append("resource_type", "raw");

      const uploadResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dcigsqglj/raw/upload",
        cloudinaryFormData
      );

      try {
        const analysisResponse = await axios.post(
          "https://ml-mvqr.onrender.com/content/detect-domain-from-file",
          {
            file_url: uploadResponse.data.secure_url
          }
        );

        setFileDetails(prev => [...prev, {
          fileName: file.name,
          fileUrl: uploadResponse.data.secure_url,
          domain: analysisResponse.data.domain || 'Unknown',
          subdomain: analysisResponse.data.subdomain || 'Unknown',
          explanation: analysisResponse.data.explanation || '',
          uploaded: true,
          isEditing: false
        }]);

        setNotes(prev => [...prev, uploadResponse.data.secure_url]);
        toast.success("File analyzed successfully");
      } catch (analysisError) {
        console.error("Analysis error:", analysisError);
        setFileDetails(prev => [...prev, {
          fileName: file.name,
          fileUrl: uploadResponse.data.secure_url,
          domain: 'Unknown',
          subdomain: 'Unknown',
          explanation: '',
          uploaded: true,
          isEditing: true
        }]);

        setNotes(prev => [...prev, uploadResponse.data.secure_url]);
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
    } catch (error) {
      console.error("Error adding course:", error);
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
    return fileDetails.map((file, index) => (
      <div key={index}>
        <button onClick={() => setSelectedDocument(file.fileUrl)}>Preview</button>
        <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">Open</a>
        <input
          type="text"
          value={file.domain}
          onChange={(e) => updateFileDomain(index, 'domain', e.target.value)}
          placeholder="Enter domain"
        />
        <input
          type="text"
          value={file.subdomain}
          onChange={(e) => updateFileDomain(index, 'subdomain', e.target.value)}
          placeholder="Enter subdomain"
        />
      </div>
    ));
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

  return (
    <>
      <Header />


      
      

      <div className="container mx-auto p-4">
        <button
          onClick={toggleModal}
          className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Add Course
        </button>
      </div>

      {/* Courses List */}
      <div className="container mx-auto p-4">
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white p-2 rounded-lg shadow-md border border-gray-200 h-[500px] overflow-auto"
              >
                <img
                  src={course.image}
                  className="w-full h-[300px] rounded-xl"
                />
                <h2 className="text-xl font-bold mb-4 mt-5">
                  {course.courseName}
                </h2>
                <h2 className="text-lg font-semibold mb-4 mt-5">
                  {course.description}
                </h2>
                <p>
                  <strong>Notes:</strong> {course.notes.length} notes
                </p>
                
                <p>
                  <strong>Lectures:</strong> {course.videoLectures.length}{" "}
                  lectures
                </p>
                <p>
                  <strong>Quizzes:</strong> {course.quizes.length} quizzes
                </p>
                <p>
                  <strong>Videos:</strong> {course.videos.length} videos
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => toggleCourseModal(course)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    See More
                  </button>
                  <button
                    onClick={() => handleQuiz(course._id)}
                    className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition duration-300"
                  >
                    Add Quiz
                  </button>
                  <button
                    onClick={() => deleteCourse(course._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No courses available.</p>
        )}
      </div>
        

      <div className="justify-self-center">
  <div className="text-center w-full bg-gray-100 p-6 rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Labelled Documents</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {domainData?.domains?.map((dom, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow h-[300px] flex flex-col"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Domain: <span className="text-blue-600">{dom.domainName}</span>
          </h2>
          <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
            <ul className="space-y-2">
              {dom.documents.map((doc, docIndex) => (
                <li 
                  key={docIndex}
                  className="bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <a 
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm block truncate"
                    title={doc.split('/').pop()} // Shows full filename on hover
                  >
                    {doc.split('/').pop()} {/* Only show filename */}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {dom.documents.length} {dom.documents.length === 1 ? 'Document' : 'Documents'}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

      


      {/* Modal for adding a course */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-3/4 max-w-3xl p-6 shadow-lg h-[600px] overflow-auto">
            <h2 className="text-2xl font-bold text-center mb-4">Add Course</h2>
            <div className="space-y-4">

            <div>
                <label className="block font-semibold mb-2">Course Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImage(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              {/* Course Name */}
              <div>
                <label className="block font-semibold mb-2">Course Name</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course name"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Course Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description of the course"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Course Content
                </label>
                <textarea
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Content of the course"
                />
              </div>
             


              {/* Videos */}
              <div>
                <label className="block font-semibold mb-2">Videos</label>
                <input
                  type="file"
                  onChange={(e) => uploadVideos(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Uploaded Videos: {videos.length}
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold mb-2">Notes</label>
                <input
                  type="file"
                  onChange={(e) => uploadNotes(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Uploaded Notes: {notes.length}
                </p>
              </div>

              {/* Video Lectures */}
              <div>
                <label className="block font-semibold mb-2">
                  Video Lectures
                </label>
                {videoLectures.map((lecture, index) => (
                  <div key={index} className="flex items-center gap-4 mb-2">
                    <input
                      type="url"
                      value={lecture}
                      onChange={(e) =>
                        updateLectureInput(index, e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter lecture URL"
                    />
                    {index === videoLectures.length - 1 && (
                      <button
                        onClick={addLectureInput}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                      >
                        Add Another
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={toggleModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={submitCourse}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Submit
              </button>
            </div>

            {renderFileDetails()}
          </div>
        </div>
      )}

      {/* Modal for course details */}
      {isCourseModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-3/4 max-w-3xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">
              {selectedCourse.courseName}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Notes:</h3>
                <ul className="list-disc pl-6">
                  {selectedCourse.notes.map((note, index) => (
                    <li key={index}>
                      <a
                        href={note}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {note}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Uploaded Videos:</h3>
                <ul className="list-disc pl-6">
                  {selectedCourse.videos.map((note, index) => (
                    <li key={index}>
                      <a
                        href={note}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {note}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Youtube Lectures:</h3>
                <ul className="list-disc pl-6">
                  {selectedCourse.videoLectures.map((lecture, index) => (
                    <li key={index}>
                      <a
                        href={lecture}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {lecture}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedCourse.quizes.length > 0 && (
                <div>
                  <h3 className="font-semibold">Quizzes:</h3>
                  <ul className="list-disc pl-6">
                    {selectedCourse.quizes.map((quiz) => (
                      <li key={quiz._id}>{quiz.quizName}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 gap-5">
              <button
                onClick={() => handleQuiz(selectedCourse._id)}
                className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition duration-300"
              >
                Add Quiz
              </button>
              <button
                onClick={toggleCourseModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {renderSeeMoreModal()}

      {renderDocumentPreview()}
    </>
  );
};

export default Course;
