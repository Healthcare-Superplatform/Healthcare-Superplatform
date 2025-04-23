import React from "react";
import SymptomChecker from '../SymptomChecker';
import MedicalRecordsPage from '../../pages/MedicalRecordsPage';
import EmergencyMedicalPage from '../../pages/workforce/EmergencyMedicalPage';

const ChatMessage = ({ message }) => {
  if (message.type === "component") {
    let componentToRender = null;
    switch (message.component) {
      case "symptomChecker":
        componentToRender = <SymptomChecker />;
        break;
      case "medicalRecordsPage":
        componentToRender = <MedicalRecordsPage />;
        break;
      case "emergencyMedicalPage":
        componentToRender = (
          <div className="message-component-wrapper scrollable-message">
      <EmergencyMedicalPage embedded />
      </div>
        );
        break;
      default:
        componentToRender = <div>Component not found</div>;
    }

    return <div className="chat-message bot">{componentToRender}</div>;
  }

  return (
    <div className={`chat-message ${message.sender}`}>
      <div className="message-bubble" dangerouslySetInnerHTML={{ __html: message.text }} />
    </div>
  );
};

export default ChatMessage;
