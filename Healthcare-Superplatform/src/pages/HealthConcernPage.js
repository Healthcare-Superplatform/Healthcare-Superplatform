import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import HealthConcern from '../components/HealthConcern';
import '../styles/HealthConcernPage.css';

const HealthConcernPage = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      navigate("/login");
    } else {
      setUserId(storedUserId);
    }
  }, [navigate]);

  return (
    <div className="health-concern-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        {userId ? <HealthConcern userId={userId} /> : <p>⏳ Loading...</p>}
      </div>
    </div>
  );
};

export default HealthConcernPage;
