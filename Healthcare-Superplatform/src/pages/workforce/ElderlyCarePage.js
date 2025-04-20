import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../../styles/WorkforcePage.css';

const ElderlyCarePage = () => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h2>🏥 Elderly Care Services</h2>
        <p>Providing specialized healthcare services for senior citizens.</p>
      </div>
    </div>
  );
};

export default ElderlyCarePage;
