import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { IoReload } from "react-icons/io5";

const Course = () => {
  const navigate = useNavigate();
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

  const getDomains = async () => {
    try {
      const domainData = await axios.get(
        "https://aistudiumb.onrender.com/domains/all"
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
    formData.append("upload_preset", "vqohpgdn"); // Replace with your Cloudinary preset
    formData.append("cloud_name", "dcigsqglj"); // Replace with your Cloudinary cloud name

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dcigsqglj/image/upload", // Replace with your Cloudinary endpoint
        formData
      );
      const imageUrl = response.data.secure_url; // Get the secure URL of the uploaded image
      setImage(imageUrl); // Update state with the image URL
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  // Upload Notes File to Cloudinary
  const uploadNotes = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "vqohpgdn"); // Replace with your Cloudinary preset
    formData.append("resource_type", "raw");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dcigsqglj/auto/upload", // Replace with your Cloudinary endpoint
        formData
      );
      setNotes([...notes, response.data.url]);
    } catch (error) {
      console.error("Error uploading file:", error);
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
    console.log(file_url)
    try {
      // Send a request to detect the domain from the file
      const response = await axios.post("https://fullcoursegen-1.onrender.com/detect-domain-from-file", {
        file_url,
      });
  
      // Extract subDomain and fileName from the response
      const { subdomain, filename } = response.data;
  
      // Call postDomain to save subDomain and fileName
      await postDomain(subdomain, filename);
    } catch (error) {
      console.error("Error detecting domain from file:", error);
    }
  };

  const postDomain = async (domainName, document) => {
    console.log("Domain Name : ", domainName)
    console.log("Document Name : ", document)
    try {
      // Save the domain and document in the backend
      await axios.post("https://aistudiumb.onrender.com/domains/add", {
        domainName,
        document
      });
      alert("Domain added successfully!");
    } catch (error) {
      console.error("Error posting domain:", error);
    }
  };

  // Submit Form
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
      await axios.post("https://aistudiumb.onrender.com/course/createCourse", courseData);
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
        "https://aistudiumb.onrender.com/course/allCourses"
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
      await axios.post(`https://aistudiumb.onrender.com/course/delete`, {
        courseId,
      });
      alert("Course deleted successfully!");
      fetchCourses(); // Refresh the courses list after deletion
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleQuiz = async (id) => {
    try {
      localStorage.setItem("courseID", JSON.stringify(id));
      navigate("/quiz");
    } catch (error) {
      console.log(error);
    }
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
                    onClick={() => toggleCourseModal(course)}
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
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Domain: <span className="text-blue-600">{dom.domainName}</span>
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {dom.documents.map((doc, docIndex) => (
              <li key={docIndex}>
                <span className="text-blue-500 hover:underline">{doc}</span>
              </li>
            ))}
          </ul>
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
                className="bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300"
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
    </>
  );
};

export default Course;
