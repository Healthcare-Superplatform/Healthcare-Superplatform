import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import JobPortal from '../components/JobPortal';
import '../styles/JobPortalPage.css';

const JobPortalPage = () => {
  return (
    <div className="job-portal-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <JobPortal />
      </div>
    </div>
  );
};

export default JobPortalPage;
