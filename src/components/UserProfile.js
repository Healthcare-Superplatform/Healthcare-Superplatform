import React from 'react';
import '../styles/UserProfile.css';

const UserProfile = () => {
  return (
    <div className="user-profile">
      <h2>John Doe</h2>
      <p>Age: 30 | Male</p>
      <p>Last Check-Up: 12 Jan 2024</p>
      <button>Book Appointment</button>
    </div>
  );
};

export default UserProfile;
