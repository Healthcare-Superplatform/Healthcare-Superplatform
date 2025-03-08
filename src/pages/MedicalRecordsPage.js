import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MedicalRecords from '../components/MedicalRecords';
import '../styles/MedicalRecordsPage.css';

const MedicalRecordsPage = () => {
  return (
    <div className="medical-records-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <MedicalRecords />
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
