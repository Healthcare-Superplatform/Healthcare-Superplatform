import React, { useState } from 'react';
import axios from 'axios';
import SymptomChecker from './SymptomChecker';
import '../styles/AIHealthAssistant.css';

const AIHealthAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      type: 'text',
      text: `<div style="text-align: center;">🤖 <strong>Hi! How can I help you today?</strong></div><br/>
      <span style="color:#2c3e50;"><strong>Now I am available for the following services:</strong></span><br/><br/>
      ➤ <strong><span style="color:#16a085;">Enter your SSN</span></strong> to get <strong>Healthcare & Hospital Info</strong><br/>
      ➤ <strong><span style="color:#2980b9;">Type "Check symptoms"</span></strong> to access the <strong>Symptom Checker</strong><br/>
      ➤ <strong><span style="color:#8e44ad;">Ask about a disease</span></strong> or provide a <strong>keyword</strong> to get <strong>medicine suggestions</strong><br/><br/>
      ➤ <strong><span style="color:#9b59b6;">Type "Show records"</span></strong> to view your medical records</div>`
    }
  ]);
  const [userId, setUserId] = useState(null);

  const safeApiRequest = async (url, errorMessage) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      let errorMsg = errorMessage;
      if (error.response) {
        errorMsg = error.response.status === 404
          ? 'The requested resource was not found'
          : 'Server error, please try again later';
      }
      setMessages(prev => [...prev, { sender: 'bot', text: `⚠️ Error: ${errorMsg}` }]);
      return null;
    }
  };

  const handleUserMessage = async () => {
    const userInput = input.trim();
    if (!userInput) return;

    setMessages(prev => [...prev, { sender: 'user', type: 'text', text: userInput }]);
    setInput('');

    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('symptom') || lowerInput.includes('check symptoms')) {
      setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: '🩺 Opening Symptom Checker...' }, { sender: 'bot', type: 'component', component: 'symptomChecker' }]);
      return;
    }

    if (lowerInput.includes('show records') || lowerInput.includes('medical records')) {
      setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: 'Opening your medical records...' }, { sender: 'bot', type: 'component', component: 'medicalRecords', props: { userId } }]);
      return;
    }

    const ssnMatch = userInput.match(/\b\d{3}-\d{2}-\d{4}\b|\b\d{1,9}\b/);
    if (ssnMatch) {
      setUserId(ssnMatch[0]);
      await fetchSSNData(ssnMatch[0]);
      return;
    }

    const diseaseName = extractDiseaseName(userInput);
    if (diseaseName) {
      await fetchMedicineData(diseaseName);
    } else {
      setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: 'ℹ️ Please specify a disease clearly.' }]);
    }
  };

  const fetchSSNData = async (ssn) => {
    const data = await safeApiRequest(`/api/own_medical?ssn=${encodeURIComponent(ssn)}`, 'Failed to fetch medical records');
    if (data) {
      setMessages(prev => [...prev, { sender: 'bot', text: JSON.stringify(data, null, 2) }]);
    }
  };

  const extractDiseaseName = (text) => {
    return text.replace(/medicine|for|about/gi, '').trim();
  };

  const fetchMedicineData = async (diseaseName) => {
    await safeApiRequest(`/api/search_medicine?disease=${encodeURIComponent(diseaseName)}`, 'Failed to fetch medicine data');
  };

  return (
    <div className="ai-health-assistant">
      <h2>🤖 AI Health Assistant Chatbot</h2>
      <div className="chatbox">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.type === 'text' ? (
              <p dangerouslySetInnerHTML={{ __html: msg.text }} />
            ) : msg.type === 'component' && msg.component === 'symptomChecker' ? (
              <SymptomChecker />
            ) : msg.type === 'component' && msg.component === 'medicalRecords' ? (
              <div>📂 Medical Records Component</div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." onKeyDown={(e) => e.key === 'Enter' && handleUserMessage()} />
        <button onClick={handleUserMessage}>Send</button>
      </div>
    </div>
  );
};

export default AIHealthAssistant;
