import React, { useState, useEffect } from 'react';
import '../styles/HealthStatus.css';

const HealthStatus = ({ userId }) => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return; // Ensure we only fetch data if userId exists

    // ✅ Simulated API call for user-specific health status
    const fetchHealthStatus = async () => {
      setLoading(true);

      try {
        // Simulated database of health data per user
        const userHealthData = {
          "101": { steps: 7500, heartRate: 72, bloodPressure: "120/80", nextDose: "8 PM" },
          "102": { steps: 5000, heartRate: 80, bloodPressure: "130/85", nextDose: "9 PM" },
        };

        // ✅ Get health status for the logged-in user
        setHealthData(userHealthData[userId] || null);
      } catch (error) {
        console.error("Error fetching health status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthStatus();
  }, [userId]);

  return (
    <div className="health-status">
      <h2>Health Status Summary</h2>

      {loading ? (
        <p>⏳ Loading health data...</p>
      ) : healthData ? (
        <div className="stats">
          <div className="bg-green">🏃 Steps: {healthData.steps}</div>
          <div className="bg-blue">❤️ Heart Rate: {healthData.heartRate} bpm</div>
          <div className="bg-yellow">🩸 Blood Pressure: {healthData.bloodPressure}</div>
          <div className="bg-red">💊 Next Dose: {healthData.nextDose}</div>
        </div>
      ) : (
        <p>⚠️ No health data available for this user.</p>
      )}
    </div>
  );
};

export default HealthStatus;
