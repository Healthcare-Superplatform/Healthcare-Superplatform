
import React from "react";
import ChatMessage from "./ChatMessage";

const Chatbox = ({ messages }) => {
  return (
    <div className="chatbox">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} message={msg} />
      ))}
    </div>
  );
};

export default Chatbox;
