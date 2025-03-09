import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId"); // ✅ Clear user session
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <header className="header">
      <h1>🏥 SuperPlatform</h1>
      <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
    </header>
  );
};

export default Header;
