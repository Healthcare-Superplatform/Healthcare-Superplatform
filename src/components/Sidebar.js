import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link to="/">🏠 Dashboard</Link></li>
        <li><Link to="/appointments">📅 Appointments</Link></li>
        <li><Link to="/medical-records">📜 Medical Records</Link></li>
        <li><Link to="/lifestyle-insights">💡 Lifestyle Insights</Link></li>
        <li><Link to="/settings">⚙️ Settings</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
