import React, { useState, useEffect } from 'react';
import '../styles/HealthConcern.css';

const HealthConcern = ({ userId }) => {
  // ✅ State for storing user-specific health concerns
  const [healthConcerns, setHealthConcerns] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Simulated API fetch (Replace with an actual API call)
  useEffect(() => {
    const fetchHealthConcerns = async () => {
      setLoading(true);
      
      try {
        // Simulated fetch request (Replace with API call)
        const fetchedConcerns = {
          101: [ // Data for User 101
            { id: 1, condition: "Hypertension", severity: "Critical" },
            { id: 2, condition: "Diabetes", severity: "Moderate" }
          ],
          102: [ // Data for User 102
            { id: 3, condition: "Seasonal Allergies", severity: "Mild" },
            { id: 4, condition: "Vitamin Deficiency", severity: "Low Risk" }
          ]
        };

        // ✅ Get concerns based on userId (default to empty array if no data found)
        const userConcerns = fetchedConcerns[userId] || [];
        setHealthConcerns(userConcerns);
      } catch (error) {
        console.error("Error fetching health concerns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthConcerns();
  }, [userId]); // ✅ Fetch new data when userId changes

  // ✅ Categorize concerns based on severity
  const majorProblems = healthConcerns.filter((concern) => concern.severity === "Critical" || concern.severity === "Moderate");
  const minorProblems = healthConcerns.filter((concern) => concern.severity === "Mild" || concern.severity === "Low Risk");

  // ✅ Map severity levels to colors
  const severityColors = {
    "Critical": "bg-red-500 text-white",
    "Moderate": "bg-orange-500 text-white",
    "Mild": "bg-yellow-300",
    "Low Risk": "bg-green-300"
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold">Health Concerns</h2>

      {/* ✅ Show loading state */}
      {loading ? (
        <p>⏳ Loading health concerns...</p>
      ) : healthConcerns.length === 0 ? (
        <p>✅ No health concerns detected.</p>
      ) : (
        <>
          {/* ✅ Major Problems */}
          {majorProblems.length > 0 && (
            <div className="mt-2">
              <h3 className="text-red-500 font-bold">Major Problems</h3>
              {majorProblems.map((concern) => (
                <div key={concern.id} className={`p-2 rounded my-2 ${severityColors[concern.severity]}`}>
                  {concern.condition} - {concern.severity}
                </div>
              ))}
            </div>
          )}

          {/* ✅ Minor Problems */}
          {minorProblems.length > 0 && (
            <div className="mt-2">
              <h3 className="text-yellow-500 font-bold">Minor Problems</h3>
              {minorProblems.map((concern) => (
                <div key={concern.id} className={`p-2 rounded my-2 ${severityColors[concern.severity]}`}>
                  {concern.condition} - {concern.severity}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HealthConcern;
