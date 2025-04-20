import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MedicalRecords from '../components/MedicalRecords';
import RecordCategoryTabs from '../components/RecordCategoryTabs';
import Login from './Login';
import '../styles/MedicalRecordsPage.css';

const MedicalRecordsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginKey, setLoginKey] = useState(0);
  const [firstSession, setFirstSession] = useState(!localStorage.getItem("firstSessionDone"));

  useEffect(() => {
    const ssn = localStorage.getItem('ssn');
    const userId = localStorage.getItem('userId');

    // ✅ Validate session
    if (ssn && userId && ssn !== 'null' && userId !== 'null') {
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("ssn");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      setIsLoggedIn(false);
    }
    setChecking(false);
  }, [loginKey]);

  const recordCategories = [
    { id: 'all', label: 'All Records' },
    { id: 'vital', label: 'Vital Signs' },
    { id: 'lab', label: 'Lab Tests' },
    { id: 'imaging', label: 'Imaging' },
    { id: 'treatment', label: 'Treatments' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setLoginKey(prev => prev + 1);
    setFirstSession(false);
    localStorage.setItem("firstSessionDone", "true");
  };

  const handleLogout = () => {
    localStorage.removeItem('ssn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setLoginKey(prev => prev + 1);
  };

  if (checking) return <div>🔒 Checking authentication...</div>;
  if (!isLoggedIn) return <Login setIsLoggedIn={handleLoginSuccess} key={`login-${loginKey}`} />;

  return (
    <div className="medical-records-page" key={`records-${loginKey}`}>
      <Sidebar />
      <div className="main-content">
        <Header title="Medical Records" />

        {firstSession && (
          <div className="logout-button-container" style={{ textAlign: 'right', margin: '10px' }}>
            <button onClick={handleLogout} style={{ padding: '6px 12px' }}>🚪 Logout</button>
          </div>
        )}

        <div className="records-content">
          <RecordCategoryTabs
            categories={recordCategories}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div className="records-section">
            <MedicalRecords filter={activeTab} />
          </div>

          <div className="health-summary">
            <h3>Health Summary</h3>
            <p>
              Viewing{' '}
              {activeTab === 'all'
                ? 'all'
                : recordCategories.find((c) => c.id === activeTab)?.label.toLowerCase()}{' '}
              records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
