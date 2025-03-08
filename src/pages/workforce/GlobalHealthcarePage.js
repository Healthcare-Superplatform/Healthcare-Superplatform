import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../../styles/WorkforcePage.css';

const GlobalHealthcarePage = () => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h2>🌍 International Healthcare Specialists</h2>
        <p>Access telemedicine and global healthcare experts remotely.</p>
      </div>
    </div>
  );
};

export default GlobalHealthcarePage;
