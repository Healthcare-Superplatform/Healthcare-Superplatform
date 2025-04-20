
import React from "react";
import SymptomChecker from "../SymptomChecker";

const ChatMessage = ({ message }) => {
  if (message.type === "text") {
    return (
      <div className={`chat-message ${message.sender}`}>
        <p dangerouslySetInnerHTML={{ __html: message.text }} />
      </div>
    );
  }

  if (message.type === "component" && message.component === "symptomChecker") {
    return (
      <div className="chat-message bot">
        <SymptomChecker />
      </div>
    );
  }

  return null;
};

export default ChatMessage;
