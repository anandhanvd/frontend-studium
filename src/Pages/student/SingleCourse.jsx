import React, { useEffect, useState } from "react";
import StudentHeader from "../../components/StudentHeader";
import axios from "axios";

const SingleCourse = () => {
  const id = JSON.parse(localStorage.getItem("userSelectedCourse"));
  const [courseData, setCourseData] = useState(null);
  const [domaindata, setDomainData] = useState("");
  const [courseName, setCourseName] = useState("");
  const fetchDomains = async (domainName) => {
    try {
      const data  = await axios.post(
        "aistudiumb.onrender.com/domains/search",
        { domainName}
      );
      setDomainData(data)
      console.log(data)
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };


  // Fetch course data
  const getSingleCourse = async () => {
    try {
      const { data } = await axios.post(
        "https://aistudiumb.onrender.com/course/singleCourse",
        { courseId: id }
      );
      setCourseData(data?.course);
      setCourseName(data.course.courseName)
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    getSingleCourse();
    
  }, []);

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
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Content</h2>
          <p className="text-gray-600">{courseData.content}</p>
        </div>

        {/* Video Lectures */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            Uploaded Lectures
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData.videos?.map((video, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-lg shadow p-4 relative"
              >
                <iframe
                  className="w-full rounded-lg"
                  height="300"
                  src={video.replace("http", "https")}
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



        {/* Video Lectures */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            Youtube Lectures
          </h2>
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

        {/* Notes */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            Course Notes
          </h2>
          <ul className="list-disc list-inside text-gray-600">
            {courseData.notes.map((note, index) => (
              <li key={index} className="mb-2">
                <a
                  href={note}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Download Note {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quizzes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Quizzes</h2>
          <ul className="list-disc list-inside text-gray-600">
            {courseData.quizes.map((quiz, index) => (
              <li key={index} className="mb-2">
                <button
                  onClick={() => console.log("Quiz selected", quiz)}
                  className="text-blue-500 hover:underline"
                >
                  {quiz.quizName}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white mt-10 rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Recommended Notes</h2>
          <ul className="list-disc list-inside text-gray-600">
            {courseData.notes.map((note, index) => (
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
    </>
  );
};

export default SingleCourse;
