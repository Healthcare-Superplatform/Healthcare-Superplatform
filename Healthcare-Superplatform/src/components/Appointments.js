import React, { useState, useEffect } from 'react';
import '../styles/Appointments.css';

const Appointments = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const userAppointments = {
      "101": [
        { id: 1, doctor: "Dr. Smith", date: "15 Jan 2024", time: "10:00 AM", location: "City Hospital" }
      ],
      "102": [
        { id: 2, doctor: "Dr. Emma", date: "20 Jan 2024", time: "2:00 PM", location: "Green Clinic" }
      ]
    };

    setAppointments(userAppointments[userId] || []);
  }, [userId]);

  return (
    <div className="appointments">
      <h2>Upcoming Appointments</h2>
      {appointments.length > 0 ? (
        appointments.map((appt) => (
          <div key={appt.id} className="appointment-details">
            <p>👨‍⚕️ <strong>{appt.doctor}</strong></p>
            <p>📅 <strong>Date:</strong> {appt.date} | ⏰ <strong>Time:</strong> {appt.time}</p>
            <p>📍 <strong>Location:</strong> {appt.location}</p>
          </div>
        ))
      ) : (
        <p>✅ No upcoming appointments.</p>
      )}
    </div>
  );
};

export default Appointments;
