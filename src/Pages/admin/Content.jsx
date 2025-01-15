import React, { useState } from "react";
import Header from "../../components/Header";
import axios from "axios";

const Content = () => {
  const [content, setContent] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async () => {
    if (!content) {
      alert("Please enter some content.");
      return;
    }
    try {
      // Post content to the backend API
      const res = await axios.post("http://127.0.0.1:8000/detect-domain", {
        content,
      });
  
      let responseText = res.data;
  
      // Remove markdown-like formatting if present
      if (typeof responseText === "string") {
        responseText = responseText.replace(/```json|```/g, "");
      }
  
      // Parse sanitized response
      const parsedResponse = typeof responseText === "string"
        ? JSON.parse(responseText)
        : responseText;
  
      setResponse(parsedResponse);
      console.log(parsedResponse)
    } catch (error) {
      console.error("Error submitting content:", error);
      alert("Failed to fetch the response. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 mt-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Content Labelling
        </h2>
        <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl mx-auto">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-gray-700"
            placeholder="Enter your content here..."
          ></textarea>
          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold"
          >
            Submit
          </button>
        </div>

        {/* Display Response */}
        {response && (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              
            </h3>
            <div className="bg-gray-200 p-4 rounded-lg text-gray-700">
              <p className="mb-2 text-xl">
                <strong>Domain:</strong> {response.domain}
              </p>
              <p>
                <strong>Explanation:</strong> {response.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Content;
