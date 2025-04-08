import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MedicalRecords from '../components/MedicalRecords';
import RecordCategoryTabs from '../components/RecordCategoryTabs';
import '../styles/MedicalRecordsPage.css';

const MedicalRecordsPage = () => {
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // State for active category tab
  const navigate = useNavigate();

  // Define available record categories
  const recordCategories = [
    { id: 'all', label: 'All Records' },
    { id: 'vital', label: 'Vital Signs' },
    { id: 'lab', label: 'Lab Tests' },
    { id: 'imaging', label: 'Imaging' },
    { id: 'treatment', label: 'Treatments' }
  ];

  // Authentication check and user ID setup
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      navigate("/login");
    } else {
      setUserId(storedUserId);
    }
  }, [navigate]);

  // Handler for tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="medical-records-page">
      <Sidebar />
      <div className="main-content">
        <Header title="Medical Records" />
        
        {userId ? (
          <div className="records-content">
            {/* Category Tabs Navigation */}
            <RecordCategoryTabs
              categories={recordCategories}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            {/* Main Records Display with Filter */}
            <div className="records-section">
              <MedicalRecords 
                userId={userId} 
                filter={activeTab}
              />
            </div>

            {/* Health Summary Section */}
            <div className="health-summary">
              <h3>Health Summary</h3>
              <p>Viewing {activeTab === 'all' ? 'all' : recordCategories.find(c => c.id === activeTab)?.label.toLowerCase()} records</p>
            </div>
          </div>
        ) : (
          <div className="loading-container">
            <p>Loading user data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
