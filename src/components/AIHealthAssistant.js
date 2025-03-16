import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AIHealthAssistant.css';

const AIHealthAssistant = () => {
  const [ssn, setSsn] = useState(''); // Will hold SSN input
  const [prediction, setPrediction] = useState(''); // Will hold the result after fetching data
  const [regionData, setRegionData] = useState(''); // Will hold the fetched medical list based on region

  // Handle the check button click
  const handleCheck = async () => {
    try {
      // Make sure SSN is provided
      if (!ssn) {
        setPrediction('Please enter an SSN.');
        setRegionData('');
        return;
      }

      const ssnTrimmed = ssn.trim(); // Remove leading and trailing spaces
      console.log("Entered SSN:", ssnTrimmed); // Debugging log to see the SSN input

      // Fetch data from the /own_medical API using SSN as a query parameter
      const response = await axios.get(`http://localhost:5001/own_medical?ssn=${ssnTrimmed}`);
      const ownMedicalData = response.data;

      console.log("Fetched Own Medical Data:", ownMedicalData); // Debugging log to check the data from backend

      // If no data is found for the entered SSN
      if (ownMedicalData.length === 0) {
        setPrediction('No data found for the given SSN.');
        setRegionData('');
      } else {
        // Only take the first matched data
        const matchedData = ownMedicalData[0];
        console.log("Matched Data:", matchedData); // Check if the filtering is correct

        // Ensure the matched data is valid
        if (matchedData) {
          const { Name, 'Own Medicals': ownMedicals, Link, Location } = matchedData;

          // Split own medicals and links in case there are multiple
          const medicalsList = ownMedicals.split(',').map((item, index) => (
            <p key={index}>
              {index === 0 && <strong>Your Own Medical: </strong>} {/* Display "Your Own Medical:" only for the first item */}
              {item.trim()} (Visit: <a href={Link.split(',')[index].trim()} target="_blank" rel="noopener noreferrer">
                {Link.split(',')[index].trim()}
              </a>)
            </p>
          ));

          // Now check the region in the medical_list collection for matching location
          const regionResponse = await axios.get(`http://localhost:5001/medical_list?location=${Location}`);
          const regionData = regionResponse.data;

          // If no medical facilities are found for this location, show a message
          if (regionData.length === 0) {
            setRegionData('No medical facilities available in your region.');
          } else {
            // Display the fetched data from the medical_list along with the category
            setRegionData(
              <div>
                <h3>Others Medical in Your Region:</h3>
                {regionData.map((item, index) => (
                  <div key={index}>
                    <p><strong>Hospital Name:</strong> {item['Hospital name']}</p>
                    <p><strong>Location:</strong> {item.Location}</p>
                    <p><strong>Link:</strong> <a href={item.Link} target="_blank" rel="noopener noreferrer">{item.Link}</a></p>
                    <p><strong>Category:</strong> {item.Category}</p> {/* Display the category here */}
                  </div>
                ))}
              </div>
            );
          }

          // Set the result to be shown
          setPrediction(
            <div>
              <p><strong>Name:</strong> {Name}</p>
              {medicalsList}
              <p><strong>Location:</strong> {Location}</p>
            </div>
          );
        } else {
          setPrediction('No matching data found for the given SSN.');
          setRegionData('');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setPrediction('Error fetching data. Please try again.');
      setRegionData('');
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
          <button onClick={handleCheck}>Check</button>
        </div>
        <div className="prediction">
          {prediction}
        </div>
        <div className="region-data">
          {regionData}
        </div>
      </div>
    </>
  );
};

export default AIHealthAssistant;
