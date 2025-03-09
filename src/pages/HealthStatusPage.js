import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import HealthStatus from '../components/HealthStatus';
import '../styles/HealthStatusPage.css';

const HealthStatusPage = () => {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      navigate("/login"); // ✅ Redirect to login if not authenticated
    } else {
      setUserId(storedUserId);
    }
  }, [navigate]);

  return (
    <div className="health-status-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        {userId ? <HealthStatus userId={userId} /> : <p>⏳ Loading user data...</p>}
      </div>
    </div>
  );
};

export default HealthStatusPage;
