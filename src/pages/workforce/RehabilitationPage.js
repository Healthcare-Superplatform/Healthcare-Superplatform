import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../../styles/WorkforcePage.css';

const RehabilitationPage = () => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h2>🏃 Rehabilitation & Physical Therapy</h2>
        <p>Find physiotherapists and rehabilitation specialists for post-surgery recovery and sports therapy.</p>
      </div>
    </div>
  );
};

export default RehabilitationPage;
