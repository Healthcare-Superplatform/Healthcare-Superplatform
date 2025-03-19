import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AIHealthAssistant.css';

const AIHealthAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '🤖 Hi! How can I help you today? You can provide your SSN or ask about a disease.' }
  ]);

  const handleUserMessage = async () => {
    const userInput = input.trim();
    if (!userInput) return;

    setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
    const botResponse = { sender: 'bot', text: '' };

    const ssnMatch = userInput.match(/\b\d{3}-\d{2}-\d{4}\b|\b\d{1,9}\b/);
    
    if (ssnMatch) {
      const ssn = ssnMatch[0];
      console.log("🔍 Detected SSN:", ssn);

      try {
        const ownMedicalRes = await axios.get(`http://localhost:5001/own_medical?ssn=${encodeURIComponent(ssn)}`);
        const ownMedicalData = ownMedicalRes.data;

        if (ownMedicalData.length === 0) {
          setMessages(prev => [...prev, { sender: 'bot', text: "❌ No medical information found for this SSN." }]);
        } else {
          const { Name, 'Own Medicals': ownMedicals, Link, Location } = ownMedicalData[0];

          const medicalList = ownMedicals.split(',').map(item => item.trim());
          const linkList = Link.split(',').map(item => item.trim());

          let medicalHistoryFormatted = '';
          medicalList.forEach((medical, index) => {
            const currentLink = linkList[index] || '#';
            medicalHistoryFormatted += `- ${medical} ([Visit](${currentLink}))\n`;
          });

          botResponse.text = `👤 **Name:** ${Name}\n📍 **Location:** ${Location}\n\n🩺 **Medical History:**\n${medicalHistoryFormatted}`;

          const regionRes = await axios.get(`http://localhost:5001/medical_list?location=${encodeURIComponent(Location)}`);
          const regionData = regionRes.data;
          
          const validFacilities = regionData.filter(facility =>
            facility['Hospital name'] && facility['Location']
          );
          
          if (validFacilities.length > 0) {
            botResponse.text += `\n\n🏥 **Other Medical Facilities in ${Location}:**\n`;
          
            validFacilities.forEach((facility) => {
              const hospitalName = facility['Hospital name'];
              const link = facility['Link']?.trim() ? facility['Link'] : null;
              const category = facility['Category(Public/private)']?.trim() || "Not specified";
          
              if (link) {
                botResponse.text += `- **${hospitalName}** (${category}) [Visit Link](${link})\n`;
              } else {
                botResponse.text += `- **${hospitalName}** (${category}) (No Link Available)\n`;
              }
            });
          } else {
            botResponse.text += `\n\nℹ️ No other medical facilities found in your region.`;
          }
          

          setMessages(prev => [...prev, botResponse]);
        }
      } catch (error) {
        console.error("❌ Error fetching medical data:", error);
        setMessages(prev => [...prev, { sender: 'bot', text: "⚠️ Error fetching medical records. Please try again later." }]);
      }
    } else {
      const diseaseName = extractDiseaseName(userInput);

      if (diseaseName) {
        await fetchMedicineData(diseaseName);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: "ℹ️ Please specify a disease clearly." }]);
      }
      
    }

    setInput('');
  };
  const extractDiseaseName = (text) => {
    text = text.toLowerCase().trim();
  
    // Comprehensive removal of unnecessary words and phrases
    const phrasesToRemove = [
      "can you", "could you", "may i", "can i", "should i", "please",
      "help me for", "get help for", "do you help",
      "help me with", "help me", "help",
      "what medicine should i take", "what medicine is necessary",
      "what medicine should i take", "medicine is necessary", "medicine necessary",
      "medicine for", "medicine is necessary", "medicine should i take",
      "what medicine", "which medicine",
      "what", "how", "tell me about", "tell me",
      "give me", "i have", "recommend", "suggest",
      "medicine", "medicines", "drugs", "drug",
      "for", "is", "with", "about", "take", "needed", "necessary", "use",
      "should", "must", "get"
    ];
  
    phrasesToRemove.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      text = text.replace(regex, '');
    });
  
    // Clean up extra whitespace
    text = text.replace(/\s{2,}/g, " ").trim();
  
    return text.length > 2 ? text : null;
  };
  
  
  
  
  
  const fetchMedicineData = async (diseaseName) => {
    const botResponse = { sender: 'bot', text: '' };
    try {
      console.log("🩺 Fetching medicines for:", diseaseName);
      const response = await axios.get(`http://localhost:5001/search_medicine?disease=${encodeURIComponent(diseaseName)}`);
      const medicines = response.data;

      if (Array.isArray(medicines) && medicines.length > 0) {
        botResponse.text = `💊 **Medicines for ${diseaseName}:**\n\n`;
        medicines.forEach((item, idx) => {
          botResponse.text += `${idx + 1}. **${item.name}**\n   - Manufacturer: ${item.manufacturer}\n   - Substance: ${item.substance_name}\n   - Description: ${item.description}\n\n`;
        });
      } else {
        botResponse.text = `ℹ️ No medicines found for "${diseaseName}".`;
      }

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("❌ Error fetching medicines:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "⚠️ Error fetching medicines. Please try again later." }]);
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
            <p dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}></p>
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
