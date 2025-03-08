import React from 'react';
import '../styles/HealthStatus.css';

const HealthStatus = () => {
  return (
    <div className="health-status">
      <h2>Health Status Summary</h2>
      <div className="stats">
        <div className="bg-green">🏃 Steps: 5000</div>
        <div className="bg-blue">❤️ Heart Rate: 72 bpm</div>
        <div className="bg-yellow">🩸 Blood Pressure: 120/80</div>
        <div className="bg-red">💊 Next Dose: 8 PM</div>
      </div>
    </div>
  );
};

export default HealthStatus;
