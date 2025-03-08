import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  // Keep Workforce Tracker dropdown open if on a Workforce page
  const [workforceDropdown, setWorkforceDropdown] = useState(false);

  useEffect(() => {
    const isWorkforcePage = location.pathname.startsWith('/workforce');
    setWorkforceDropdown(isWorkforcePage);
  }, [location.pathname]);

  return (
    <nav className="sidebar">
      <h2>🏥 SuperPlatform</h2>
      <ul>
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>🏠 Dashboard</Link></li>
        <li><Link to="/appointments" className={location.pathname === '/appointments' ? 'active' : ''}>📅 Appointments</Link></li>
        <li><Link to="/medical-records" className={location.pathname === '/medical-records' ? 'active' : ''}>📜 Medical Records</Link></li>
        <li><Link to="/lifestyle-insights" className={location.pathname === '/lifestyle-insights' ? 'active' : ''}>💡 Lifestyle Insights</Link></li>
        <li><Link to="/job-portal" className={location.pathname === '/job-portal' ? 'active' : ''}>💼 Healthcare Jobs</Link></li>
        <li><Link to="/patient-education" className={location.pathname === '/patient-education' ? 'active' : ''}>📚 Patient Education</Link></li>

        {/* Workforce Tracker - Dropdown Toggle */}
        <li>
          <button 
            className="dropdown-btn" 
            onClick={() => setWorkforceDropdown(!workforceDropdown)}
          >
            👩‍⚕️ Workforce Tracker ▾
          </button>
          <ul className={`dropdown-menu ${workforceDropdown ? '' : 'hidden'}`}>
            <li><Link to="/workforce/elderly-care" className={location.pathname === '/workforce/elderly-care' ? 'active' : ''}>👴 Elderly Care</Link></li>
            <li><Link to="/workforce/local-healthcare" className={location.pathname === '/workforce/local-healthcare' ? 'active' : ''}>🏠 Local Experts</Link></li>
            <li><Link to="/workforce/global-healthcare" className={location.pathname === '/workforce/global-healthcare' ? 'active' : ''}>🌍 Global Experts</Link></li>
            <li><Link to="/workforce/emergency-medical" className={location.pathname === '/workforce/emergency-medical' ? 'active' : ''}>🚑 Emergency Services</Link></li>
            <li><Link to="/workforce/specialized-medical" className={location.pathname === '/workforce/specialized-medical' ? 'active' : ''}>🩺 Specialized Experts</Link></li>
            <li><Link to="/workforce/mental-health" className={location.pathname === '/workforce/mental-health' ? 'active' : ''}>🧠 Mental Health</Link></li>
            <li><Link to="/workforce/rehabilitation" className={location.pathname === '/workforce/rehabilitation' ? 'active' : ''}>🏃 Rehabilitation</Link></li>
            <li><Link to="/workforce/maternity-care" className={location.pathname === '/workforce/maternity-care' ? 'active' : ''}>🤰 Maternity Care</Link></li>
            <li><Link to="/workforce/pediatric-care" className={location.pathname === '/workforce/pediatric-care' ? 'active' : ''}>👶 Pediatric Health</Link></li>
            <li><Link to="/workforce/home-based-care" className={location.pathname === '/workforce/home-based-care' ? 'active' : ''}>🏠 Home-Based Care</Link></li>
          </ul>
        </li>

        <li><Link to="/ai-health-assistant" className={location.pathname === '/ai-health-assistant' ? 'active' : ''}>🤖 AI Health Assistant</Link></li>
        <li><Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>⚙️ Settings</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
