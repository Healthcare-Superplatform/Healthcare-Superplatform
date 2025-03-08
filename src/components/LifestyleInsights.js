import React from 'react';
import '../styles/LifestyleInsights.css';

const LifestyleInsights = () => {
  return (
    <div className="lifestyle-insights">
      <h2>Lifestyle Insights & Recommendations</h2>
      
      <div className="section">
        <h3>🏃 Activity Suggestions</h3>
        <p>Try a 30-minute walk daily to improve heart health.</p>
      </div>
      
      <div className="section">
        <h3>🍎 Nutrition Tips</h3>
        <p>Increase fiber intake for better digestion.</p>
      </div>
      
      <div className="section">
        <h3>🛏️ Sleep Analysis</h3>
        <p>Average Sleep: 7 hours | Quality Score: 85%</p>
      </div>
      
      <div className="section">
        <h3>😌 Mental Health Tracker</h3>
        <p>Last Mood Log: Happy 😊 | Stress Level: Moderate</p>
      </div>
    </div>
  );
};

export default LifestyleInsights;
