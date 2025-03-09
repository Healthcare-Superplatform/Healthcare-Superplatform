import React, { useState, useEffect } from 'react';
import '../styles/MedicalRecords.css';

const MedicalRecords = ({ userId }) => {
  // ✅ State for storing user-specific medical records
  const [medicalRecords, setMedicalRecords] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Simulated API fetch (Replace with an actual API call)
  useEffect(() => {
    const fetchMedicalRecords = async () => {
      setLoading(true);
      
      try {
        // Simulated fetch request (Replace with API call)
        const fetchedRecords = {
          101: { 
            labReports: [{ id: 1, name: "Blood Test Report", fileUrl: "/reports/blood-test.pdf" }],
            prescriptions: [{ id: 1, doctor: "Dr. Smith", date: "12 Jan 2024" }],
            consultations: [{ id: 1, specialty: "Cardiologist", lastVisit: "10 Jan 2024" }]
          },
          102: { 
            labReports: [{ id: 2, name: "MRI Scan Report", fileUrl: "/reports/mri-scan.pdf" }],
            prescriptions: [{ id: 2, doctor: "Dr. Alice", date: "08 Jan 2024" }],
            consultations: [{ id: 2, specialty: "Neurologist", lastVisit: "05 Jan 2024" }]
          }
        };

        // ✅ Get medical records based on userId (default to empty)
        const userRecords = fetchedRecords[userId] || { labReports: [], prescriptions: [], consultations: [] };
        setMedicalRecords(userRecords);
      } catch (error) {
        console.error("Error fetching medical records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [userId]); // ✅ Fetch new data when userId changes

  // ✅ Handle uploading of a new medical record
  const handleUploadRecord = () => {
    alert("📤 Feature coming soon: Upload medical records!");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold">Medical Records & History</h2>

      {/* ✅ Show loading state */}
      {loading ? (
        <p>⏳ Loading medical records...</p>
      ) : (
        <>
          {/* ✅ Recent Lab Reports */}
          <div className="mt-2">
            <h3 className="font-bold">Recent Lab Reports</h3>
            {medicalRecords.labReports.length > 0 ? (
              medicalRecords.labReports.map((report) => (
                <p key={report.id}>
                  📝 {report.name} - <a href={report.fileUrl} className="bg-blue-500 text-white px-2 py-1 rounded">Download</a>
                </p>
              ))
            ) : (
              <p>🔍 No lab reports available.</p>
            )}
          </div>

          {/* ✅ Prescriptions History */}
          <div className="mt-2">
            <h3 className="font-bold">Prescriptions History</h3>
            {medicalRecords.prescriptions.length > 0 ? (
              medicalRecords.prescriptions.map((prescription) => (
                <p key={prescription.id}>💊 Prescription from {prescription.doctor} on {prescription.date}</p>
              ))
            ) : (
              <p>🔍 No prescriptions found.</p>
            )}
          </div>

          {/* ✅ Past Consultations */}
          <div className="mt-2">
            <h3 className="font-bold">Past Consultations</h3>
            {medicalRecords.consultations.length > 0 ? (
              medicalRecords.consultations.map((consultation) => (
                <p key={consultation.id}>🩺 Last visit to {consultation.specialty}: {consultation.lastVisit}</p>
              ))
            ) : (
              <p>🔍 No consultation history available.</p>
            )}
          </div>

          {/* ✅ Upload New Record Button */}
          <button onClick={handleUploadRecord} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
            Upload New Record
          </button>
        </>
      )}
    </div>
  );
};

export default MedicalRecords;
