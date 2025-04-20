import React from 'react';
import '../styles/JobPortal.css';

const JobPortal = () => {
  return (
    <div className="job-portal">
      <h2>🏥 Healthcare Job Listings</h2>
      <div className="job-list">
        <div className="job-card">
          <h3>Emergency Room Nurse</h3>
          <p>🏥 City Hospital</p>
          <button className="apply-btn">Apply Now</button>
        </div>
        <div className="job-card">
          <h3>General Physician</h3>
          <p>🏥 MedCare Clinic</p>
          <button className="apply-btn">Apply Now</button>
        </div>
      </div>
    </div>
  );
};

export default JobPortal;
