import React from 'react';
import '../styles/Appointments.css';

const Appointments = () => {
  return (
    <div className="appointments">
      <h2>Upcoming Appointments</h2>
      <div className="appointment-details">
        <p>👨‍⚕️ <strong>Dr. Smith</strong> - Cardiologist</p>
        <p>📅 <strong>Date:</strong> 15 Jan 2024 | ⏰ <strong>Time:</strong> 10:00 AM</p>
        <p>📍 <strong>Location:</strong> City Hospital</p>
      </div>
    </div>
  );
};

export default Appointments;
