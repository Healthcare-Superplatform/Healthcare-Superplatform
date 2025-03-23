import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SymptomChecker from '../components/SymptomChecker';

const SymptomCheckerPage = () => {
  return (
    <div className="symptom-checker">
      <Sidebar />
      <div className="main-content">
        <Header />
        <SymptomChecker />
      </div>
    </div>
  );
};

export default SymptomCheckerPage;
