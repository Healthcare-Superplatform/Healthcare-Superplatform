import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';
import HealthStatus from '../components/HealthStatus';
import HealthConcern from '../components/HealthConcern';
import Appointments from '../components/Appointments';
import MedicalRecords from '../components/MedicalRecords';
import BottomNav from '../components/BottomNav';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // ✅ State for storing user ID (Can be retrieved from authentication or local storage)
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Simulated fetch for user authentication (Replace with actual authentication logic)
  useEffect(() => {
    const fetchUserId = async () => {
      setLoading(true);
      try {
        // Simulating a user login session fetch (Replace this with real authentication logic)
        const storedUserId = localStorage.getItem("userId") || "101"; // Default user 101
        setUserId(storedUserId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <Header />

        {/* ✅ Show loading state until user ID is available */}
        {loading ? (
          <p>⏳ Loading dashboard...</p>
        ) : (
          <>
            <UserProfile userId={userId} />
            <HealthStatus userId={userId} />
            <HealthConcern userId={userId} />
            <Appointments userId={userId} />
            <MedicalRecords userId={userId} />
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
