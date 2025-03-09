import React, { useState, useEffect } from 'react';
import '../styles/Appointments.css';

const Appointments = () => {
  // ✅ State for storing appointments
  const [appointments, setAppointments] = useState([]);

  // ✅ Simulated API fetch (Replace with actual API)
  useEffect(() => {
    // Simulating a fetch request (Replace this with an actual API call)
    const fetchedAppointments = [
      { id: 1, doctor: "Dr. Smith", specialty: "Cardiologist", date: "15 Jan 2024", time: "10:00 AM", location: "City Hospital" },
      { id: 2, doctor: "Dr. Alice", specialty: "Dermatologist", date: "18 Jan 2024", time: "2:30 PM", location: "Healthcare Clinic" },
      { id: 3, doctor: "Dr. John", specialty: "Neurologist", date: "20 Jan 2024", time: "11:00 AM", location: "Metro Hospital" }
    ];
    setAppointments(fetchedAppointments);
  }, []);

  return (
    <div className="appointments">
      <h2>Upcoming Appointments</h2>
      
      {appointments.length === 0 ? (
        <p>🔍 No upcoming appointments found.</p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-details">
            <p>👨‍⚕️ <strong>{appointment.doctor}</strong> - {appointment.specialty}</p>
            <p>📅 <strong>Date:</strong> {appointment.date} | ⏰ <strong>Time:</strong> {appointment.time}</p>
            <p>📍 <strong>Location:</strong> {appointment.location}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Appointments;
