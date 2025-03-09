import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  // ✅ Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userId"));

  useEffect(() => {
    // ✅ Listen for login status changes
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("userId"));
    };

    // ✅ Check login status when component mounts
    checkLoginStatus();

    // ✅ Listen for storage changes (if user logs out in another tab)
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("userId"); // ✅ Clear user session
    localStorage.removeItem("userName");
    setIsLoggedIn(false); // ✅ Update state
    navigate("/login");
  };

  return (
    <header className="header">
      <h1>🏥 SuperPlatform</h1>

      {/* ✅ Show Logout Button Only If User Is Logged In */}
      {isLoggedIn && (
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      )}
    </header>
  );
};

export default Header;
