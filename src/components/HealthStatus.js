import React, { useState, useEffect } from 'react';
import '../styles/HealthStatus.css';

const HealthStatus = () => {
  // ✅ State for storing user's health data
  const [healthData, setHealthData] = useState(null);

  // ✅ Simulated API fetch (Replace with actual API call)
  useEffect(() => {
    // Simulated health data (Can be replaced with real-time user data)
    const fetchedHealthData = {
      steps: 6500,
      heartRate: 75,
      bloodPressure: "118/76",
      nextDose: "8 PM"
    };

    setHealthData(fetchedHealthData);
  }, []);

  return (
    <div className="health-status">
      <h2>Health Status Summary</h2>

      {/* ✅ Show Loading State if Data is Not Available */}
      {!healthData ? (
        <p>⏳ Loading health data...</p>
      ) : (
        <div className="stats">
          <div className="bg-green">🏃 Steps: {healthData.steps}</div>
          <div className="bg-blue">❤️ Heart Rate: {healthData.heartRate} bpm</div>
          <div className="bg-yellow">🩸 Blood Pressure: {healthData.bloodPressure}</div>
          <div className="bg-red">💊 Next Dose: {healthData.nextDose}</div>
        </div>
      )}
    </div>
  );
};

export default HealthStatus;
