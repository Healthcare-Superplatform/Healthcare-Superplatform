import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/SettingsPage.css';

const SettingsPage = () => {
  return (
    <div className="settings-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="settings-container">
          <h2>Settings</h2>

          <div className="settings-section">
            <h3>⚙️ Account Settings</h3>
            <p>Manage your account details.</p>
          </div>

          <div className="settings-section">
            <h3>🔔 Notification Preferences</h3>
            <p>Customize your notification settings.</p>
          </div>

          <div className="settings-section">
            <h3>📱 App Permissions</h3>
            <div className="settings-options">
              <label><input type="checkbox" checked /> Allow Location Access</label>
              <label><input type="checkbox" checked /> Enable Push Notifications</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;