import React from 'react';
import '../styles/MedicalRecords.css';

const MedicalRecords = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold">Medical Records & History</h2>
      <div className="mt-2">
        <h3 className="font-bold">Recent Lab Reports</h3>
        <p>📝 Blood Test Report - <button className="bg-blue-500 text-white px-2 py-1 rounded">Download</button></p>
      </div>
      <div className="mt-2">
        <h3 className="font-bold">Prescriptions History</h3>
        <p>💊 Prescription from Dr. Smith</p>
      </div>
      <div className="mt-2">
        <h3 className="font-bold">Past Consultations</h3>
        <p>🩺 Last visit to Cardiologist: 10 Jan 2024</p>
      </div>
      <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">Upload New Record</button>
    </div>
  );
};

export default MedicalRecords;
