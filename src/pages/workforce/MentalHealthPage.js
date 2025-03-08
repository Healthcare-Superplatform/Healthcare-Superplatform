import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../../styles/WorkforcePage.css';

const MentalHealthPage = () => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h2>🧠 Mental Health Support</h2>
        <p>Access psychologists, therapists, and stress management programs for mental wellness.</p>
      </div>
    </div>
  );
};

export default MentalHealthPage;
