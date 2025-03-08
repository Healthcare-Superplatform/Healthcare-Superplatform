import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import WorkforceTracker from '../components/WorkforceTracker';
import '../styles/WorkforcePage.css';

const WorkforcePage = () => {
  return (
    <div className="workforce-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <WorkforceTracker />
      </div>
    </div>
  );
};

export default WorkforcePage;
