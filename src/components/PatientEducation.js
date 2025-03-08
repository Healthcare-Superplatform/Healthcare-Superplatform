import React from 'react';
import '../styles/PatientEducation.css';

const PatientEducation = () => {
  return (
    <div className="patient-education">
      <h2>📚 Health Education Center</h2>
      <div className="language-selection">
        <label>🌍 Select Language:</label>
        <select>
          <option>English</option>
          <option>Español</option>
          <option>Français</option>
        </select>
      </div>
      <div className="education-content">
        <h3>Understanding Diabetes</h3>
        <p>Diabetes is a chronic disease that affects how your body processes sugar...</p>
      </div>
    </div>
  );
};

export default PatientEducation;
