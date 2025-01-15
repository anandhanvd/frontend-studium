import React, { useState } from "react";
import { TbMessageChatbot } from "react-icons/tb";
import { AiOutlineSend } from "react-icons/ai";

const Chatbot = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello, how can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("https://fullcoursegen.onrender.com/doubt-chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ques: input }),
      });
      const data = await response.json();
      console.log(response)
      setMessages([
        ...newMessages,
        { sender: "bot", text: data.answer || "I'm sorry, I couldn't process that." },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "An error occurred. Please try again later." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-0">
      {/* Chatbot Icon */}
      <div
        onClick={() => setShowChatbot(true)}
        className="text-white p-3 rounded-full m-10 bg-blue-500 shadow-lg hover:scale-110 transition transform duration-300 cursor-pointer"
      >
        <TbMessageChatbot size={50} />
      </div>

      {showChatbot && (
        <div className="bg-white shadow-lg rounded-lg fixed bottom-32 right-12 w-80 h-96 flex flex-col">
          {/* Chatbot Header */}
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center rounded-t-lg">
            <h2 className="text-lg font-semibold">Chatbot</h2>
            <button
              onClick={() => setShowChatbot(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
            >
              X
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  } px-4 py-2 rounded-lg max-w-xs text-sm shadow-md`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-black px-4 py-2 rounded-lg max-w-xs text-sm shadow-md">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input Field */}
          <div className="p-3 bg-gray-100 flex items-center space-x-2 rounded-b-lg">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow-md"
            >
              <AiOutlineSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
