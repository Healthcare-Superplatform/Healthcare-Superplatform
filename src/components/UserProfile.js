import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const currentUser = Object.values(users).find(user => user.id === userId);
    setUser(currentUser);
  }, [userId]);

  return (
    <div className="user-profile">
      {user ? (
        <>
          <h2>{user.name}</h2>
          <p>User ID: {userId}</p>
          <p>Last Check-Up: 12 Jan 2024</p>
          <button>Book Appointment</button>
        </>
      ) : (
        <p>⏳ Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
