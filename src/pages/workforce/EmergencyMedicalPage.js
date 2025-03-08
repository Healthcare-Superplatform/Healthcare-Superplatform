import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../../styles/WorkforcePage.css';

const EmergencyMedicalPage = () => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h2>🚑 Emergency Medical Services</h2>
        <p>Get immediate emergency medical support and ambulance services.</p>
      </div>
    </div>
  );
};

export default EmergencyMedicalPage;
