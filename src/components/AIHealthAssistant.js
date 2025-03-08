import React, { useState } from 'react';
import '../styles/AIHealthAssistant.css';

const AIHealthAssistant = () => {
  const [symptoms, setSymptoms] = useState('');
  const [prediction, setPrediction] = useState('');

  const handleCheck = () => {
    if (symptoms.toLowerCase().includes('fever')) {
      setPrediction('Possible flu or infection. Consult a doctor.');
    } else {
      setPrediction('No major risk detected. Maintain a healthy lifestyle.');
    }
  };

  return (
    <div className="ai-health-assistant">
      <h2>🤖 AI Health Assistant</h2>
      <div className="symptom-checker">
        <label>Enter Symptoms:</label>
        <input
          type="text"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <button onClick={handleCheck}>Check</button>
      </div>
      <p className="prediction">{prediction}</p>
    </div>
  );
};

export default AIHealthAssistant;
