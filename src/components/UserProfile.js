import React, { useState, useEffect } from 'react';
import '../styles/UserProfile.css';

const UserProfile = ({ userId }) => {
  // ✅ State for storing user-specific profile data
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Simulated API fetch (Replace with an actual API call)
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      
      try {
        // Simulated fetch request (Replace with API call)
        const fetchedUsers = {
          101: { name: "John Doe", age: 30, gender: "Male", lastCheckup: "12 Jan 2024" },
          102: { name: "Emma Watson", age: 28, gender: "Female", lastCheckup: "05 Jan 2024" }
        };

        // ✅ Get user profile based on userId (default to a guest profile)
        const userData = fetchedUsers[userId] || { name: "Guest User", age: "N/A", gender: "Unknown", lastCheckup: "No record" };
        setUserProfile(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]); // ✅ Fetch new data when userId changes

  // ✅ Handle Booking Appointment
  const handleBookAppointment = () => {
    alert(`📅 Booking an appointment for ${userProfile.name}`);
  };

  return (
    <div className="user-profile">
      {/* ✅ Show loading state */}
      {loading ? (
        <p>⏳ Loading user profile...</p>
      ) : (
        <>
          <h2>{userProfile.name}</h2>
          <p>Age: {userProfile.age} | {userProfile.gender}</p>
          <p>Last Check-Up: {userProfile.lastCheckup}</p>
          <button onClick={handleBookAppointment} className="book-btn">Book Appointment</button>
        </>
      )}
    </div>
  );
};

export default UserProfile;
