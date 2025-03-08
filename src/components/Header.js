import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-logo">SuperPlatform</h1>
      <div className="header-icons">
        <span>🔔</span>
        <Link to="/settings">
          <img src="/profile.png" alt="Profile" className="profile-icon" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
