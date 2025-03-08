import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Appointments from '../components/Appointments';
import '../styles/AppointmentsPage.css';

const AppointmentsPage = () => {
  return (
    <div className="appointments-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Appointments />
      </div>
    </div>
  );
};

export default AppointmentsPage;
