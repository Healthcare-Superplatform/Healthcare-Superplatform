import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../../styles/WorkforcePage.css';

const SpecializedMedicalPage = () => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h2>🩺 Specialized Medical Experts</h2>
        <p>Connect with expert doctors in cardiology, neurology, oncology, and other specialized fields.</p>
      </div>
    </div>
  );
};

export default SpecializedMedicalPage;
