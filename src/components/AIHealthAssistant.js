import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AIHealthAssistant.css';

const AIHealthAssistant = () => {
  const [ssn, setSsn] = useState(''); // SSN input
  const [disease, setDisease] = useState(''); // Disease input
  const [prediction, setPrediction] = useState('');
  const [regionData, setRegionData] = useState('');
  const [medicineData, setMedicineData] = useState(''); // Medicine data from OpenFDA

  // Handle the check button click
  const handleCheck = async () => {
    try {
        // If no input is provided, prompt the user to enter either SSN or disease
        if (!ssn && !disease) {
            setPrediction('Please enter either SSN or Disease name.');
            setRegionData('');
            setMedicineData('');
            return;
        }

        // If SSN is provided, search by SSN
        if (ssn) {
            const ssnTrimmed = ssn.trim();
            console.log("Entered SSN:", ssnTrimmed);

            const response = await axios.get(`http://localhost:5001/own_medical?ssn=${ssnTrimmed}`);
            const ownMedicalData = response.data;

            if (ownMedicalData.length === 0) {
                setPrediction('No data found for the given SSN.');
                setRegionData('');
            } else {
                const matchedData = ownMedicalData[0];
                const { Name, 'Own Medicals': ownMedicals, Link, Location } = matchedData;
                const medicalsList = ownMedicals.split(',').map((item, index) => (
                    <p key={index}>
                        {index === 0 && <strong>Your Own Medical: </strong>}
                        {item.trim()} (Visit: <a href={Link.split(',')[index].trim()} target="_blank" rel="noopener noreferrer">
                            {Link.split(',')[index].trim()}
                        </a>)
                    </p>
                ));

                const regionResponse = await axios.get(`http://localhost:5001/medical_list?location=${Location}`);
                const regionData = regionResponse.data;

                if (regionData.length === 0) {
                    setRegionData('No medical facilities available in your region.');
                } else {
                    setRegionData(
                        <div>
                            <h3>Others Medical in Your Region:</h3>
                            {regionData.map((item, index) => (
                                <div key={index}>
                                    <p><strong>Hospital Name:</strong> {item.Hospital_Name}</p>
                                    <p><strong>Location:</strong> {item.Location}</p>
                                    <p><strong>Link:</strong> <a href={item.Link} target="_blank" rel="noopener noreferrer">{item.Link}</a></p>
                                </div>
                            ))}
                        </div>
                    );
                }

                setPrediction(
                    <div>
                        <p><strong>Name:</strong> {Name}</p>
                        {medicalsList}
                        <p><strong>Location:</strong> {Location}</p>
                    </div>
                );
            }
        }

        // If disease is provided, search for medicines related to the disease
        if (disease) {
          const diseaseTrimmed = disease.trim();  // Trim disease input
          console.log("Searching medicines for disease:", diseaseTrimmed);  // Debugging log
        
          try {
            const response = await axios.get(`http://localhost:5001/search_medicine?disease=${diseaseTrimmed}`);
            const medicineData = response.data;
        
            if (medicineData && medicineData.length > 0) {
              setMedicineData(
                <div>
                  <h3>Medicines for {diseaseTrimmed}:</h3>
                  {medicineData.map((item, index) => (
                    <div key={index}>
                      <p><strong>Medicine Name:</strong> {item.name}</p>
                      <p><strong>Manufacturer:</strong> {item.manufacturer}</p>
                      <p><strong>Substance Name:</strong> {item.substance_name}</p>
                      <p><strong>Description:</strong> {item.description}</p>
                    </div>
                  ))}
                </div>
              );
            } else {
              setMedicineData('No medicines found for this disease.');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            setMedicineData('Error fetching data. Please try again.');
          }
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
        setPrediction('Error fetching data. Please try again.');
        setRegionData('');
        setMedicineData('');
    }
};


  return (
    <>
      <div className="ai-health-assistant">
        <h2>🤖 AI Health Assistant</h2>
        <div className="symptom-checker">
          <label>Enter Your SSN:</label>
          <input
            type="text"
            value={ssn}
            onChange={(e) => setSsn(e.target.value)}
            placeholder="Enter SSN"
          />
          <label>Or Enter a Disease Name:</label>
          <input
            type="text"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            placeholder="Enter Disease"
          />
          <button onClick={handleCheck}>Check</button>
        </div>
        <div className="prediction">
          {prediction}
        </div>
        <div className="region-data">
          {regionData}
        </div>
        <div className="medicine-data">
          {medicineData}
        </div>
      </div>
    </>
  );
};

export default AIHealthAssistant;
