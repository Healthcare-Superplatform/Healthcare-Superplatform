import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);

  const [workforceDropdown, setWorkforceDropdown] = useState(location.pathname.startsWith('/workforce'));
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("ssn"));

  useEffect(() => {
    if (sidebarRef.current) {
      const savedScrollPosition = sessionStorage.getItem('sidebarScrollPosition');
      if (savedScrollPosition !== null) {
        sidebarRef.current.scrollTo({ top: parseInt(savedScrollPosition, 10), behavior: "instant" });
      }
    }

    if (dropdownRef.current) {
      const savedDropdownScroll = sessionStorage.getItem('dropdownScrollPosition');
      if (savedDropdownScroll !== null) {
        dropdownRef.current.scrollTo({ top: parseInt(savedDropdownScroll, 10), behavior: "instant" });
      }
    }
  }, []);

  const handleScroll = () => {
    if (sidebarRef.current) {
      sessionStorage.setItem('sidebarScrollPosition', sidebarRef.current.scrollTop);
    }
    if (dropdownRef.current) {
      sessionStorage.setItem('dropdownScrollPosition', dropdownRef.current.scrollTop);
    }
  };

  const handleMenuItemClick = (event, path) => {
    event.preventDefault();

    if (sidebarRef.current) {
      sessionStorage.setItem('sidebarScrollPosition', sidebarRef.current.scrollTop);
    }
    if (dropdownRef.current) {
      sessionStorage.setItem('dropdownScrollPosition', dropdownRef.current.scrollTop);
    }

    setActiveItem(path);
    navigate(path);
  };

  const handleDropdownToggle = () => {
    setWorkforceDropdown(!workforceDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem('ssn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    window.location.reload(); // force immediate UI update
  };

  return (
    <nav className="sidebar" ref={sidebarRef} onScroll={handleScroll}>
      <h2>🏥 SuperPlatform</h2>
      <ul>
        <li><Link to="/dashboard" onClick={(e) => handleMenuItemClick(e, '/dashboard')} className={activeItem === '/dashboard' ? 'active' : ''}>🏠 Dashboard</Link></li>
        <li><Link to="/appointments" onClick={(e) => handleMenuItemClick(e, '/appointments')} className={activeItem === '/appointments' ? 'active' : ''}>📅 Appointments</Link></li>
        <li><Link to="/health-status" onClick={(e) => handleMenuItemClick(e, '/health-status')} className={activeItem === '/health-status' ? 'active' : ''}>💖 Health Status</Link></li>
        <li><Link to="/health-concern" onClick={(e) => handleMenuItemClick(e, '/health-concern')} className={activeItem === '/health-concern' ? 'active' : ''}>🚑 Health Concerns</Link></li>
        <li><Link to="/medical-records" onClick={(e) => handleMenuItemClick(e, '/medical-records')} className={activeItem === '/medical-records' ? 'active' : ''}>📜 Medical Records</Link></li>
        <li><Link to="/lifestyle-insights" onClick={(e) => handleMenuItemClick(e, '/lifestyle-insights')} className={activeItem === '/lifestyle-insights' ? 'active' : ''}>💡 Lifestyle Insights</Link></li>
        <li><Link to="/job-portal" onClick={(e) => handleMenuItemClick(e, '/job-portal')} className={activeItem === '/job-portal' ? 'active' : ''}>💼 Healthcare Jobs</Link></li>
        <li><Link to="/patient-education" onClick={(e) => handleMenuItemClick(e, '/patient-education')} className={activeItem === '/patient-education' ? 'active' : ''}>📚 Patient Education</Link></li>
        <li><Link to="/feedback" onClick={(e) => handleMenuItemClick(e, '/feedback')} className={activeItem === '/feedback' ? 'active' : ''}>⭐ Rate Assistant</Link></li>

        {/* Workforce Dropdown */}
        <li>
          <button className={`dropdown-btn ${workforceDropdown ? 'active' : ''}`} onClick={handleDropdownToggle}>
            👩‍⚕️ Workforce Tracker ▾
          </button>
          {workforceDropdown && (
            <ul className="dropdown-menu" ref={dropdownRef} onScroll={handleScroll}>
              <li><Link to="/workforce/elderly-care" onClick={(e) => handleMenuItemClick(e, '/workforce/elderly-care')} className={activeItem === '/workforce/elderly-care' ? 'active' : ''}>👴 Elderly Care</Link></li>
              <li><Link to="/workforce/local-healthcare" onClick={(e) => handleMenuItemClick(e, '/workforce/local-healthcare')} className={activeItem === '/workforce/local-healthcare' ? 'active' : ''}>🏠 Local Experts</Link></li>
              <li><Link to="/workforce/global-healthcare" onClick={(e) => handleMenuItemClick(e, '/workforce/global-healthcare')} className={activeItem === '/workforce/global-healthcare' ? 'active' : ''}>🌍 Global Experts</Link></li>
              <li><Link to="/workforce/emergency-medical" onClick={(e) => handleMenuItemClick(e, '/workforce/emergency-medical')} className={activeItem === '/workforce/emergency-medical' ? 'active' : ''}>🚑 Emergency Services</Link></li>
              <li><Link to="/workforce/specialized-medical" onClick={(e) => handleMenuItemClick(e, '/workforce/specialized-medical')} className={activeItem === '/workforce/specialized-medical' ? 'active' : ''}>🩺 Specialized Experts</Link></li>
              <li><Link to="/workforce/mental-health" onClick={(e) => handleMenuItemClick(e, '/workforce/mental-health')} className={activeItem === '/workforce/mental-health' ? 'active' : ''}>🧠 Mental Health</Link></li>
              <li><Link to="/workforce/rehabilitation" onClick={(e) => handleMenuItemClick(e, '/workforce/rehabilitation')} className={activeItem === '/workforce/rehabilitation' ? 'active' : ''}>🏃 Rehabilitation</Link></li>
              <li><Link to="/workforce/maternity-care" onClick={(e) => handleMenuItemClick(e, '/workforce/maternity-care')} className={activeItem === '/workforce/maternity-care' ? 'active' : ''}>🤰 Maternity Care</Link></li>
              <li><Link to="/workforce/pediatric-care" onClick={(e) => handleMenuItemClick(e, '/workforce/pediatric-care')} className={activeItem === '/workforce/pediatric-care' ? 'active' : ''}>👶 Pediatric Health</Link></li>
              <li><Link to="/workforce/home-based-care" onClick={(e) => handleMenuItemClick(e, '/workforce/home-based-care')} className={activeItem === '/workforce/home-based-care' ? 'active' : ''}>🏠 Home-Based Care</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/ai-health-assistant">🤖 AI Health Assistant</Link></li>
        <li><Link to="/symptom-checker">🤖 Symptom Checker</Link></li>
        <li><Link to="/settings">⚙️ Settings</Link></li>

        {/* ✅ Logout only if logged in */}
        {isLoggedIn && (
          <li style={{ marginTop: "20px", textAlign: "center" }}>
            <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
