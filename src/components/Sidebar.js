import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null); // ✅ Reference for dropdown scrolling

  // ✅ Workforce Dropdown State (Starts Closed but Opens if Already Inside Workforce)
  const [workforceDropdown, setWorkforceDropdown] = useState(location.pathname.startsWith('/workforce'));

  // ✅ Restore Sidebar & Dropdown Scroll Position After Re-Renders
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

  // ✅ Save Sidebar & Dropdown Scroll Position on Scroll
  const handleScroll = () => {
    if (sidebarRef.current) {
      sessionStorage.setItem('sidebarScrollPosition', sidebarRef.current.scrollTop);
    }
    if (dropdownRef.current) {
      sessionStorage.setItem('dropdownScrollPosition', dropdownRef.current.scrollTop);
    }
  };

  // ✅ Save Scroll Position Before Clicking & Navigate
  const handleMenuItemClick = (event, path) => {
    event.preventDefault();

    if (sidebarRef.current) {
      sessionStorage.setItem('sidebarScrollPosition', sidebarRef.current.scrollTop);
    }
    if (dropdownRef.current) {
      sessionStorage.setItem('dropdownScrollPosition', dropdownRef.current.scrollTop);
    }

    navigate(path);
  };

  // ✅ Ensure Workforce Dropdown Stays Open When Navigating Inside Workforce
  useEffect(() => {
    if (location.pathname.startsWith('/workforce')) {
      setWorkforceDropdown(true);
    }
  }, [location.pathname]);

  // ✅ Toggle Workforce Tracker Dropdown Manually
  const handleDropdownToggle = () => {
    setWorkforceDropdown(!workforceDropdown);
  };

  return (
    <nav className="sidebar" ref={sidebarRef} onScroll={handleScroll}>
      <h2>🏥 SuperPlatform</h2>
      <ul>
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>🏠 Dashboard</Link></li>
        <li><Link to="/appointments" className={location.pathname === '/appointments' ? 'active' : ''}>📅 Appointments</Link></li>
        <li><Link to="/medical-records" className={location.pathname === '/medical-records' ? 'active' : ''}>📜 Medical Records</Link></li>
        <li><Link to="/lifestyle-insights" className={location.pathname === '/lifestyle-insights' ? 'active' : ''}>💡 Lifestyle Insights</Link></li>
        <li><Link to="/job-portal" className={location.pathname === '/job-portal' ? 'active' : ''}>💼 Healthcare Jobs</Link></li>
        <li><Link to="/patient-education" className={location.pathname === '/patient-education' ? 'active' : ''}>📚 Patient Education</Link></li>

        {/* ✅ Workforce Tracker Dropdown (Stays Open When Inside) */}
        <li>
          <button className={`dropdown-btn ${workforceDropdown ? 'active' : ''}`} onClick={handleDropdownToggle}>
            👩‍⚕️ Workforce Tracker ▾
          </button>
          {workforceDropdown && (
            <ul className="dropdown-menu" ref={dropdownRef} onScroll={handleScroll}>
              <li><Link to="/workforce/elderly-care" onClick={(e) => handleMenuItemClick(e, '/workforce/elderly-care')} className={location.pathname === '/workforce/elderly-care' ? 'active' : ''}>👴 Elderly Care</Link></li>
              <li><Link to="/workforce/local-healthcare" onClick={(e) => handleMenuItemClick(e, '/workforce/local-healthcare')} className={location.pathname === '/workforce/local-healthcare' ? 'active' : ''}>🏠 Local Experts</Link></li>
              <li><Link to="/workforce/global-healthcare" onClick={(e) => handleMenuItemClick(e, '/workforce/global-healthcare')} className={location.pathname === '/workforce/global-healthcare' ? 'active' : ''}>🌍 Global Experts</Link></li>
              <li><Link to="/workforce/emergency-medical" onClick={(e) => handleMenuItemClick(e, '/workforce/emergency-medical')} className={location.pathname === '/workforce/emergency-medical' ? 'active' : ''}>🚑 Emergency Services</Link></li>
              <li><Link to="/workforce/specialized-medical" onClick={(e) => handleMenuItemClick(e, '/workforce/specialized-medical')} className={location.pathname === '/workforce/specialized-medical' ? 'active' : ''}>🩺 Specialized Experts</Link></li>
              <li><Link to="/workforce/mental-health" onClick={(e) => handleMenuItemClick(e, '/workforce/mental-health')} className={location.pathname === '/workforce/mental-health' ? 'active' : ''}>🧠 Mental Health</Link></li>
              <li><Link to="/workforce/rehabilitation" onClick={(e) => handleMenuItemClick(e, '/workforce/rehabilitation')} className={location.pathname === '/workforce/rehabilitation' ? 'active' : ''}>🏃 Rehabilitation</Link></li>
              <li><Link to="/workforce/maternity-care" onClick={(e) => handleMenuItemClick(e, '/workforce/maternity-care')} className={location.pathname === '/workforce/maternity-care' ? 'active' : ''}>🤰 Maternity Care</Link></li>
              <li><Link to="/workforce/pediatric-care" onClick={(e) => handleMenuItemClick(e, '/workforce/pediatric-care')} className={location.pathname === '/workforce/pediatric-care' ? 'active' : ''}>👶 Pediatric Health</Link></li>
              <li><Link to="/workforce/home-based-care" onClick={(e) => handleMenuItemClick(e, '/workforce/home-based-care')} className={location.pathname === '/workforce/home-based-care' ? 'active' : ''}>🏠 Home-Based Care</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/ai-health-assistant">🤖 AI Health Assistant</Link></li>
        <li><Link to="/settings">⚙️ Settings</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
