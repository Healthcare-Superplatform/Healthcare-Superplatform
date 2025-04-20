import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LifestyleInsights from '../components/LifestyleInsights';
import '../styles/LifestyleInsightsPage.css';

const LifestyleInsightsPage = () => {
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
    <div className="lifestyle-insights-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        {userId ? <LifestyleInsights userId={userId} /> : <p>⏳ Loading...</p>}
      </div>
    </div>
  );
};

export default LifestyleInsightsPage;
