import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../../styles/WorkforcePage.css';

const LocalHealthcarePage = () => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h2>🏠 Local Healthcare Experts</h2>
        <p>Find regional healthcare specialists and local medical services.</p>
      </div>
    </div>
  );
};

export default LocalHealthcarePage;
