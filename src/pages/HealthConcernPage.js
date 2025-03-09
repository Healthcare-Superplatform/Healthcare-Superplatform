import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import HealthConcern from '../components/HealthConcern';
import '../styles/HealthConcernPage.css';

const HealthConcernPage = () => {
  // ✅ State for storing user ID (Can be retrieved from authentication or local storage)
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Simulated fetch for user authentication (Replace with actual authentication logic)
  useEffect(() => {
    const fetchUserId = async () => {
      setLoading(true);
      try {
        // Simulating user login session fetch (Replace this with real authentication logic)
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
    <div className="health-concern-page">
      <Sidebar />
      <div className="main-content">
        <Header />

        {/* ✅ Show loading state until user ID is available */}
        {loading ? (
          <p>⏳ Loading health concerns...</p>
        ) : (
          <HealthConcern userId={userId} />
        )}
      </div>
    </div>
  );
};

export default HealthConcernPage;
