import React, { useState, useEffect } from 'react';
import '../styles/LifestyleInsights.css';

const LifestyleInsights = ({ userId }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInsights = {
      "101": {
        activity: "Try a 30-minute jog daily for heart health.",
        nutrition: "Increase protein intake to improve muscle recovery.",
        sleep: "Average Sleep: 6.5 hours | Quality Score: 78%",
        mentalHealth: "Last Mood Log: Stressed 😟 | Recommended: Meditation"
      },
      "102": {
        activity: "Try yoga for flexibility and mental relaxation.",
        nutrition: "Drink more water and eat fiber-rich foods.",
        sleep: "Average Sleep: 8 hours | Quality Score: 92%",
        mentalHealth: "Last Mood Log: Happy 😊 | Keep up the good work!"
      }
    };

    setInsights(userInsights[userId] || null);
    setLoading(false);
  }, [userId]);

  return (
    <div className="lifestyle-insights">
      <h2>Lifestyle Insights & Recommendations</h2>

      {loading ? (
        <p>⏳ Loading lifestyle insights...</p>
      ) : insights ? (
        <>
          <div className="section">
            <h3>🏃 Activity Suggestions</h3>
            <p>{insights.activity}</p>
          </div>
          <div className="section">
            <h3>🍎 Nutrition Tips</h3>
            <p>{insights.nutrition}</p>
          </div>
          <div className="section">
            <h3>🛏️ Sleep Analysis</h3>
            <p>{insights.sleep}</p>
          </div>
          <div className="section">
            <h3>😌 Mental Health Tracker</h3>
            <p>{insights.mentalHealth}</p>
          </div>
        </>
      ) : (
        <p>✅ No insights available for this user.</p>
      )}
    </div>
  );
};

export default LifestyleInsights;
