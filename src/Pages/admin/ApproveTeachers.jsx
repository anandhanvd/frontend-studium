import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold text-center text-blue-600 mb-8">Approve Teachers</h2>
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {unapprovedTeachers.map(teacher => (
          <div key={teacher._id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">{teacher.name}</h3>
            <p className="text-gray-600">{teacher.email}</p>
            
              <button
                onClick={() => approveTeacher(teacher._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Approve
              </button>
           
          </div>

        ))}
      </div>
      <button
        onClick={() => navigate('/course')}
        className="mt-8 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
      >
        Close
      </button>
    </div>
  );
};

export default ApproveTeachers;