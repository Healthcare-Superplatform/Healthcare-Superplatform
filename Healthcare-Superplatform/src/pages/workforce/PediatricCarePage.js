import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../../styles/WorkforcePage.css';

const PediatricCarePage = () => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h2>👶 Pediatric Health Services</h2>
        <p>Find specialized pediatricians, child nutritionists, and immunization centers.</p>
      </div>
    </div>
  );
};

export default PediatricCarePage;
