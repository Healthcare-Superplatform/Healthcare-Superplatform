import React from "react";
import SymptomChecker from "../SymptomChecker";
import MedicalRecordsPage from "../../pages/MedicalRecordsPage";

const ChatMessage = ({ message }) => {
  if (message.type === "text") {
    return (
      <div className={`chat-message ${message.sender}`}>
        <p dangerouslySetInnerHTML={{ __html: message.text }} />
      </div>
    );
  }

  if (message.type === "component") {
    if (message.component === "symptomChecker") {
      return (
        <div className="chat-message bot">
          <SymptomChecker />
        </div>
      );
    }

    if (message.component === "medicalRecordsPage") {
      return (
        <div className="chat-message bot">
          <MedicalRecordsPage />
        </div>
      );
    }
  }

  return null;
};

export default ChatMessage;
