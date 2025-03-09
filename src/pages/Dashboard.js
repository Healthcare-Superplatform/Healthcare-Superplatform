import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import UserProfile from '../components/UserProfile';
import HealthStatus from '../components/HealthStatus';
import HealthConcern from '../components/HealthConcern';
import Appointments from '../components/Appointments';
import MedicalRecords from '../components/MedicalRecords';
import BottomNav from '../components/BottomNav';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      navigate("/login"); // ✅ Redirect if user is not logged in
    } else {
      setUserId(storedUserId);
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <Header />
        {userId ? (
          <>
            <UserProfile userId={userId} />
            <HealthStatus userId={userId} />
            <HealthConcern userId={userId} />
            <Appointments userId={userId} />
            <MedicalRecords userId={userId} />
          </>
        ) : (
          <p>⏳ Loading user data...</p>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
