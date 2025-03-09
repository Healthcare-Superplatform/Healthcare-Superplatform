import React, { useState, useEffect } from 'react';
import '../styles/MedicalRecords.css';

const MedicalRecords = ({ userId }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const userRecords = {
      "101": [
        { id: 1, type: "Blood Test", date: "10 Jan 2024", doctor: "Dr. Brown" }
      ],
      "102": [
        { id: 2, type: "X-Ray", date: "5 Feb 2024", doctor: "Dr. Williams" }
      ]
    };

    setRecords(userRecords[userId] || []);
  }, [userId]);

  return (
    <div className="medical-records">
      <h2>Medical Records & History</h2>
      {records.length > 0 ? (
        records.map((record) => (
          <div key={record.id} className="record">
            <p>📝 {record.type} - <strong>{record.date}</strong></p>
            <p>👨‍⚕️ Doctor: {record.doctor}</p>
          </div>
        ))
      ) : (
        <p>✅ No medical records available.</p>
      )}
    </div>
  );
};

export default MedicalRecords;
