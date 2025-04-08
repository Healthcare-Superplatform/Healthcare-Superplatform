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
      ➤ <strong><span style="color:#8e44ad;">Ask about a disease</span></strong> or just provide a <strong>keyword</strong> to get <strong>medicine suggestions</strong>`
    }
    
    
    
  ]);

  const handleUserMessage = async () => {
    const userInput = input.trim();
    if (!userInput) return;

    setMessages(prev => [...prev, { sender: 'user', type: 'text', text: userInput }]);
    setInput('');

    const lowerInput = userInput.toLowerCase();

    // Check if user wants to open Symptom Checker
    if (lowerInput.includes('symptom') || lowerInput.includes('check symptoms') || lowerInput.includes('open symptom checker')) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', type: 'text', text: '🩺 Opening Symptom Checker...' },
        { sender: 'bot', type: 'component', component: 'symptomChecker' }
      ]);
      return;
    }

    // Check for SSN
    const ssnMatch = userInput.match(/\b\d{3}-\d{2}-\d{4}\b|\b\d{1,9}\b/);
    if (ssnMatch) {
      await fetchSSNData(ssnMatch[0]);
      return;
    }

    // Handle disease-based medicine request
    const diseaseName = extractDiseaseName(userInput);
    console.log('🧪 Extracted disease name:', diseaseName);
    if (diseaseName) {
      await fetchMedicineData(diseaseName);
    } else {
      setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: 'ℹ️ Please specify a disease clearly.' }]);
    }
  };

  const extractDiseaseName = (text) => {
    if (!text) return null;

    text = text.toLowerCase().trim();

    const phrasesToRemove = [
      'can you', 'could you', 'may i', 'should i', 'please', 'help me with', 'help me for', 'help me', 'help',
      'get help for', 'what medicine', 'which medicine', 'what should i take', 'what can i take',
      'how to treat', 'give me', 'i have', 'recommend', 'suggest', 'for', 'is', 'with', 'about', 'take', 'needed',
      'necessary', 'use', 'must', 'get', 'medicine', 'medicines', 'drugs', 'drug'
    ];

    phrasesToRemove.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      text = text.replace(regex, '');
    });

    text = text.replace(/[^\w\s]/gi, '').replace(/\s{2,}/g, ' ').trim();

    return text.length > 2 ? text : null;
  };

  const fetchMedicineData = async (diseaseName) => {
    try {
      const res = await axios.get(`http://localhost:5001/search_medicine?disease=${encodeURIComponent(diseaseName)}`);
      const medicines = res.data;

      if (!Array.isArray(medicines) || medicines.length === 0) {
        setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: `ℹ️ No medicines found for "${diseaseName}".` }]);
        return;
      }

      const limitWords = (str, maxWords = 20) => {
        const words = str.split(' ');
        return words.slice(0, maxWords).join(' ') + (words.length > maxWords ? '...' : '');
      };

      let text = `💊 <strong>Medicines for ${diseaseName}:</strong><br/><br/>`;
      medicines.forEach((med, index) => {
        text += `${index + 1}. <strong>${med.name}</strong><br/>`;
        text += `- Manufacturer: ${med.manufacturer}<br/>`;
        text += `- Substance: ${med.substance_name}<br/>`;
        text += `- Description: ${limitWords(med.description)}<br/><br/>`;
      });

      setMessages(prev => [...prev, { sender: 'bot', type: 'text', text }]);
    } catch (error) {
      console.error('❌ Error fetching medicines:', error);
      setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: '⚠️ Error fetching medicines. Please try again later.' }]);
    }
  };

  const fetchSSNData = async (ssn) => {
    try {
      const res = await axios.get(`http://localhost:5001/own_medical?ssn=${encodeURIComponent(ssn)}`);
      const data = res.data;

      if (!data || data.length === 0) {
        setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: '❌ No medical information found for this SSN.' }]);
        return;
      }

      const { Name, 'Own Medicals': ownMedicals, Link, Location } = data[0];

      const medicalList = ownMedicals.split(',').map(item => item.trim());
      const linkList = Link.split(',').map(item => item.trim());

      let message = `👤 <strong>Name:</strong> ${Name}<br/>📍 <strong>Location:</strong> ${Location}<br/><br/><strong>🩺 Medical History:</strong><br/>`;
      medicalList.forEach((m, i) => {
        message += `- ${m} (<a href="${linkList[i] || '#'}" target="_blank">Visit</a>)<br/>`;
      });

         // 🔁 Fetch regional hospitals using /medical_list
    const regionRes = await axios.get(`http://localhost:5001/medical_list?location=${encodeURIComponent(Location)}`);
    const regionHospitals = regionRes.data;

    if (regionHospitals.length > 0) {
      message += `<br/><strong>🏥 Other Medical Facilities in ${Location}:</strong><br/>`;

      regionHospitals.forEach((facility) => {
        const name = facility['Hospital name'];
        const category = facility['Category(Public/private)'] || 'Unknown';
        const link = facility['Link']?.trim() || 'Unknown';

        if (name) {
          message += `- <strong>${name}</strong> (${category})`;
          message += link ? ` <a href="${link}" target="_blank">Visit</a><br/>` : `<br/>`;
        }
      });
    }
      setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: message }]);
    } catch (error) {
      console.error('❌ Error fetching SSN data:', error);
      setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: '⚠️ Error fetching medical records. Please try again later.' }]);
    }
  };

  const formatText = (text) => {
    return text
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
  };

  return (
    <div className="ai-health-assistant">
      <h2>🤖 AI Health Assistant Chatbot</h2>
      <div className="chatbox">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.type === 'text' ? (
              <p dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
            ) : msg.type === 'component' && msg.component === 'symptomChecker' ? (
              <SymptomChecker />
            ) : null}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && handleUserMessage()}
        />
        <button onClick={handleUserMessage}>Send</button>
      </div>
    </div>
  );
};

export default AIHealthAssistant;
