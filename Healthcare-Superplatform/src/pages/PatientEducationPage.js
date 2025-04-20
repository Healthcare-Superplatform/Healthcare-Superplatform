import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PatientEducation from '../components/PatientEducation';
import '../styles/PatientEducationPage.css';

const PatientEducationPage = () => {
  return (
    <div className="patient-education-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <PatientEducation />
      </div>
    </div>
  );
};

export default PatientEducationPage;
