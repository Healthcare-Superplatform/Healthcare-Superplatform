import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MedicalRecords from '../components/MedicalRecords';
import RecordCategoryTabs from '../components/RecordCategoryTabs';
import Login from './Login';
import '../styles/MedicalRecordsPage.css';
import diseasePreventionList from '../api/diseasePreventionList';

const getDetectedDiseases = (records) =>
  records
    .map((record) => record.values?.result)
    .filter((val) => typeof val === 'string')
    .map((val) => val.trim().toLowerCase());

const getPreventionTips = (records) => {
  const detected = getDetectedDiseases(records);
  return diseasePreventionList.filter((item) =>
    detected.includes(item.disease.toLowerCase())
  );
};

const MedicalRecordsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginKey, setLoginKey] = useState(0);
  const [records, setRecords] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [firstSession, setFirstSession] = useState(!localStorage.getItem('firstSessionDone'));

  useEffect(() => {
    const ssn = localStorage.getItem('ssn');
    const userId = localStorage.getItem('userId');

    if (ssn && userId && ssn !== 'null' && userId !== 'null') {
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('ssn');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      setIsLoggedIn(false);
    }
    setChecking(false);
  }, [loginKey]);

  const handleTabChange = (tabId) => setActiveTab(tabId);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setLoginKey((prev) => prev + 1);
    setFirstSession(false);
    localStorage.setItem('firstSessionDone', 'true');
  };

  // eslint-disable-next-line no-unused-vars
  const handleLogout = () => {
    localStorage.removeItem('ssn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setLoginKey((prev) => prev + 1);
  };

  const recordCategories = [
    { id: 'all', label: 'All Records' },
    { id: 'vital', label: 'Vital Signs' },
    { id: 'lab', label: 'Lab Tests' },
    { id: 'imaging', label: 'Imaging' },
    { id: 'treatment', label: 'Treatments' },
  ];

  const preventionTips = getPreventionTips(records);

  if (checking) return <div>🔒 Checking authentication...</div>;
  if (!isLoggedIn) return <Login setIsLoggedIn={handleLoginSuccess} key={`login-${loginKey}`} />;

  return (
    <div className="medical-records-page-embedded" key={`records-${loginKey}`}>
      <Sidebar />
      <div className="main-content">
        <Header title="Medical Records" />

        <div className="records-content">
          <RecordCategoryTabs
            categories={recordCategories}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div className="records-section">
            <MedicalRecords filter={activeTab} onRecordsLoaded={setRecords} />
          </div>

          <div className="health-summary">
            {preventionTips.length > 0 && (
              <div className="prevention-section">
                <h4>Prevention Tips Based on Your Records:</h4>
                {preventionTips.map((item) => (
                  <div key={item.disease}>
                    <strong>{item.disease}</strong>
                    <ul>
                      {item.prevention.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
