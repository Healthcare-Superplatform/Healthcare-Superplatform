import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../../styles/WorkforcePage.css';

const MaternityCarePage = () => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h2>🤰 Women's & Maternity Care</h2>
        <p>Get access to gynecologists, maternity nurses, and reproductive health experts.</p>
      </div>
    </div>
  );
};

export default MaternityCarePage;
