import React, { useState, useEffect } from 'react';
import '../styles/LifestyleInsights.css';

const LifestyleInsights = ({ userId }) => {
  // ✅ State for storing lifestyle insights
  const [lifestyleData, setLifestyleData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Simulated API fetch (Replace with an actual API call)
  useEffect(() => {
    const fetchLifestyleData = async () => {
      setLoading(true);
      
      try {
        // Simulated fetch request (Replace with API call)
        const fetchedLifestyleData = {
          101: {
            activity: "Try a 30-minute walk daily to improve heart health.",
            nutrition: "Increase fiber intake for better digestion.",
            sleep: { hours: 7, quality: 85 },
            mentalHealth: { mood: "Happy 😊", stress: "Moderate" }
          },
          102: {
            activity: "Do 20 minutes of stretching exercises in the morning.",
            nutrition: "Reduce sugar intake to control energy levels.",
            sleep: { hours: 6.5, quality: 78 },
            mentalHealth: { mood: "Stressed 😟", stress: "High" }
          }
        };

        // ✅ Get lifestyle insights based on userId (default data if not found)
        const userLifestyleData = fetchedLifestyleData[userId] || {
          activity: "Engage in light physical activities daily.",
          nutrition: "Maintain a balanced diet with proteins, carbs, and fats.",
          sleep: { hours: "N/A", quality: "N/A" },
          mentalHealth: { mood: "Neutral 😐", stress: "Normal" }
        };

        setLifestyleData(userLifestyleData);
      } catch (error) {
        console.error("Error fetching lifestyle insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLifestyleData();
  }, [userId]); // ✅ Fetch new data when userId changes

  return (
    <div className="lifestyle-insights">
      <h2>Lifestyle Insights & Recommendations</h2>

      {/* ✅ Show loading state */}
      {loading ? (
        <p>⏳ Loading lifestyle insights...</p>
      ) : (
        <>
          <div className="section">
            <h3>🏃 Activity Suggestions</h3>
            <p>{lifestyleData.activity}</p>
          </div>

          <div className="section">
            <h3>🍎 Nutrition Tips</h3>
            <p>{lifestyleData.nutrition}</p>
          </div>

          <div className="section">
            <h3>🛏️ Sleep Analysis</h3>
            <p>Average Sleep: {lifestyleData.sleep.hours} hours | Quality Score: {lifestyleData.sleep.quality}%</p>
          </div>

          <div className="section">
            <h3>😌 Mental Health Tracker</h3>
            <p>Last Mood Log: {lifestyleData.mentalHealth.mood} | Stress Level: {lifestyleData.mentalHealth.stress}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default LifestyleInsights;
