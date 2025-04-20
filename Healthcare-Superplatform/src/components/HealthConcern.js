import React, { useState, useEffect } from 'react';
import '../styles/HealthConcern.css';

const HealthConcern = ({ userId }) => {
  const [healthConcerns, setHealthConcerns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userHealthConcerns = {
      "101": [
        { id: 1, condition: "Hypertension", severity: "Critical" },
        { id: 2, condition: "Diabetes", severity: "Moderate" }
      ],
      "102": [
        { id: 3, condition: "Seasonal Allergies", severity: "Mild" },
        { id: 4, condition: "Vitamin Deficiency", severity: "Low Risk" }
      ]
    };

    setHealthConcerns(userHealthConcerns[userId] || []);
    setLoading(false);
  }, [userId]);

  const severityColors = {
    "Critical": "bg-red-500 text-white",
    "Moderate": "bg-orange-500 text-white",
    "Mild": "bg-yellow-300",
    "Low Risk": "bg-green-300"
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold">Health Concerns</h2>

      {loading ? (
        <p>⏳ Loading health concerns...</p>
      ) : healthConcerns.length === 0 ? (
        <p>✅ No health concerns detected.</p>
      ) : (
        healthConcerns.map((concern) => (
          <div key={concern.id} className={`p-2 rounded my-2 ${severityColors[concern.severity]}`}>
            {concern.condition} - {concern.severity}
          </div>
        ))
      )}
    </div>
  );
};

export default HealthConcern;
