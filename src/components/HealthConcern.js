import React from 'react';
import '../styles/HealthConcern.css';

const HealthConcern = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold">Health Concerns</h2>
      <div className="mt-2">
        <h3 className="text-red-500 font-bold">Major Problems</h3>
        <div className="bg-red-500 text-white p-2 rounded my-2">
          Hypertension - Critical
        </div>
        <div className="bg-orange-500 text-white p-2 rounded my-2">
          Diabetes - Moderate
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-yellow-500 font-bold">Minor Problems</h3>
        <div className="bg-yellow-300 p-2 rounded my-2">
          Seasonal Allergies - Mild
        </div>
        <div className="bg-green-300 p-2 rounded my-2">
          Vitamin Deficiency - Low Risk
        </div>
      </div>
    </div>
  );
};

export default HealthConcern;
