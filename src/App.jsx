import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Course from "./Pages/admin/Course";
import Quiz from "./Pages/admin/Quiz";
import Questions from "./Pages/admin/Questions";
import Students from "./Pages/admin/Students";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/student/Home";
import EnrolledCourse from "./Pages/student/EnrolledCourse";
import AICuratedCourse from "./Pages/student/AICuratedCourse";
import AICuratedMCQ from "./Pages/student/AICuratedMCQ";
import AllCourses from "./Pages/student/AllCourses";
import SingleQuiz from "./Pages/student/SingleQuiz";
import SingleCourse from "./Pages/student/SingleCourse";
import Profile from "./Pages/student/Profile";
import GeneratedCoursePage from "./Pages/student/GeneratedCourse";
import Content from "./Pages/admin/Content";
import StudentsProfile from "./Pages/admin/StudentsProfile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/course" element={<Course />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/question" element={<Questions />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:userId" element={<StudentsProfile/>} />
        <Route path="/content" element={<Content/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/enrolled" element={<EnrolledCourse />} />
        <Route path="/aiCourse" element={<AICuratedCourse />} />
        <Route path="/aiMCQ" element={<AICuratedMCQ />} />
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/singleQuiz" element={<SingleQuiz />} />
        <Route path="/singleCourse" element={<SingleCourse />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/generated-course" element={<GeneratedCoursePage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
