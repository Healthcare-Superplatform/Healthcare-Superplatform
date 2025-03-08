import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';
import HealthStatus from '../components/HealthStatus';
import HealthConcern from '../components/HealthConcern';
import Appointments from '../components/Appointments';
import MedicalRecords from '../components/MedicalRecords';
import BottomNav from '../components/BottomNav';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <Header />
        <UserProfile />
        <HealthStatus />
        <HealthConcern />
        <Appointments />
        <MedicalRecords />
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
