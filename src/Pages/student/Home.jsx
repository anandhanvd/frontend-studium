import React from "react";
import StudentHeader from "../../components/StudentHeader";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100">
      {/* Header Section */}
      <StudentHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold">
            Transform Your Learning with AI Study Platform
          </h1>
          <p className="mt-6 text-xl max-w-2xl mx-auto">
            AI Study Platform empowers students with personalized learning
            paths, intelligent content recommendations, and progress tracking.
            Enhance your education with the power of AI!
          </p>
          <button
            className="mt-8 bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-gray-200"
            onClick={() => navigate("/courses")}
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Why Choose AI Study Platform?
          </h2>
          <p className="text-gray-600 text-lg mt-4 mb-10">
            Our platform provides advanced tools to personalize learning, track
            your progress, and recommend the best content for you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img
                src="https://blog.thinkcerca.com/hubfs/Personalized%20Learning/The-Importance-of-Personalized-Learning.jpg"
                alt="Personalized Learning Paths"
                className="h-40 w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Personalized Learning Paths
              </h3>
              <p className="text-gray-600 mt-2">
                Tailored courses and lessons designed to match your learning
                pace and style, ensuring optimal retention and growth.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img
                src="https://www.eidesign.net/wp-content/uploads/2024/05/AI-for-eLearning-Content-Development.jpg"
                alt="Intelligent Content Recommendations"
                className="h-40 w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Intelligent Content Recommendations
              </h3>
              <p className="text-gray-600 mt-2">
                Access AI-curated study materials that align with your interests
                and academic goals.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img
                src="https://www.actitime.com/wp-content/uploads/2020/12/How-to-Track-a-Projects-Progress.png"
                alt="Progress Tracking"
                className="h-40 w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Progress Tracking
              </h3>
              <p className="text-gray-600 mt-2">
                Stay on top of your learning journey with detailed progress
                reports and actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            About AI Study Platform
          </h2>
          <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
            AI Study Platform revolutionizes education by providing advanced
            tools for personalized learning, content discovery, and academic
            success. Whether you're preparing for exams or learning new skills,
            our platform supports your growth every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800">Get in Touch</h2>
          <p className="text-gray-600 text-lg mt-4 mb-8">
            Have any questions or need assistance? Reach out to us, and we’ll be
            delighted to help!
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full"
            onClick={() =>
              (window.location.href = "mailto:help@aistudyplatform.com")
            }
          >
            Contact Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto text-center text-white">
          <p>© 2024 AI Study Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
