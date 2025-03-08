import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <Link to="/">🏠</Link>
      <Link to="/appointments">📅</Link>
      <Link to="/medical-records">📜</Link>
      <Link to="/job-portal">💼</Link>
      <Link to="/ai-health-assistant">🤖</Link>
      <Link to="/settings">⚙️</Link>
    </nav>
  );
};

export default BottomNav;
