import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Appointments from '../components/Appointments';
import '../styles/AppointmentsPage.css';

const AppointmentsPage = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      navigate("/login"); // ✅ Redirect to login if user is not authenticated
    } else {
      setUserId(storedUserId);
    }
  }, [navigate]);

  return (
    <div className="appointments-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        {userId ? <Appointments userId={userId} /> : <p>⏳ Loading...</p>}
      </div>
    </div>
  );
};

export default AppointmentsPage;
