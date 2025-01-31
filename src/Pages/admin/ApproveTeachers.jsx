import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

const ApproveTeachers = () => {
  const [unapprovedTeachers, setUnapprovedTeachers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
      navigate('/approve-Teachers');
    }

    axios.get('https://aistudiumb-9jub.onrender.com/user/unapprovedTeachers')
      .then(response => {
        setUnapprovedTeachers(response.data.teachers);
      })
      .catch(error => {
        console.error('Error fetching unapproved teachers:', error);
      });
  }, []);

  const approveTeacher = (teacherId) => {
    axios.post('https://aistudiumb-9jub.onrender.com/user/approveTeacher', { userId: teacherId })
      .then(() => {
        setUnapprovedTeachers(prev => prev.filter(t => t._id !== teacherId));
        setSuccessMessage('Successfully approved!');
        setTimeout(() => setSuccessMessage(''), 3000);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Teacher Applications</h1>
          <p className="text-blue-100">Review and manage teacher applications</p>
        </div>
      </div>

      {/* Teachers List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unapprovedTeachers.map((teacher) => (
            <div 
              key={teacher._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Teacher Info Header */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {teacher.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{teacher.name}</h3>
                    <p className="text-gray-600">{teacher.email}</p>
                  </div>
                </div>
              </div>

              {/* Teacher Details */}
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Experience:</span>
                    <span className="font-medium text-gray-800">{teacher.experience} years</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Expertise:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {teacher.expertise && teacher.expertise.split(',').map((skill, idx) => (
                        <span 
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => approveTeacher(teacher._id)}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg 
                             hover:from-emerald-600 hover:to-emerald-700 transition duration-300"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectTeacher(teacher._id)}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg 
                             hover:from-red-600 hover:to-red-700 transition duration-300"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/course')}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2 rounded-lg 
                     hover:from-gray-700 hover:to-gray-800 transition duration-300 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveTeachers;