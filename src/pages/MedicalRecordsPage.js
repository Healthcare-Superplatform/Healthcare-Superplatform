import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MedicalRecords from '../components/MedicalRecords';
import '../styles/MedicalRecordsPage.css';

const MedicalRecordsPage = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      navigate("/login");
    } else {
      setUserId(storedUserId);
    }
  }, [navigate]);

  return (
    <div className="medical-records-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        {userId ? <MedicalRecords userId={userId} /> : <p>⏳ Loading...</p>}
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
