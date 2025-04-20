import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../../styles/WorkforcePage.css';

const HomeBasedCarePage = () => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h2>🏠 Home-Based Health Services</h2>
        <p>Connect with in-home nursing, lab testing, and medicine delivery services.</p>
      </div>
    </div>
  );
};

export default HomeBasedCarePage;
