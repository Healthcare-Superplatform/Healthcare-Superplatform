import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LifestyleInsights from '../components/LifestyleInsights';
import '../styles/LifestyleInsightsPage.css';

const LifestyleInsightsPage = () => {
  return (
    <div className="lifestyle-insights-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <LifestyleInsights />
      </div>
    </div>
  );
};

export default LifestyleInsightsPage;
