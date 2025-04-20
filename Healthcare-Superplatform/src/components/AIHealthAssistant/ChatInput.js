
import React from "react";

const ChatInput = ({ input, setInput, onSend }) => {
  return (
    <div className="chat-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <button onClick={onSend}>Send</button>
    </div>
  );
};

export default ChatInput;
