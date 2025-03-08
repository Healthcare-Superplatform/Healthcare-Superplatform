import React from 'react';
import '../styles/WorkforceTracker.css';

const WorkforceTracker = () => {
  return (
    <div className="workforce-tracker">
      <h2>👩‍⚕️ Healthcare Workforce Availability</h2>
      <div className="availability-list">
        <div className="worker-card available">
          <h3>Dr. John Doe</h3>
          <p>Specialist: Cardiologist</p>
          <p>Status: <span className="status green">Available</span></p>
        </div>
        <div className="worker-card busy">
          <h3>Nurse Emily Smith</h3>
          <p>Specialist: Emergency Care</p>
          <p>Status: <span className="status red">Busy</span></p>
        </div>
      </div>
    </div>
  );
};

export default WorkforceTracker;
