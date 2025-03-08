import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AIHealthAssistant from '../components/AIHealthAssistant';
import '../styles/AIHealthAssistantPage.css';

const AIHealthAssistantPage = () => {
  return (
    <div className="ai-health-assistant-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <AIHealthAssistant />
      </div>
    </div>
  );
};

export default AIHealthAssistantPage;
