
import React from "react";

const FeedbackToggle = ({ onClick }) => {
  return (
    <button className="feedback-fullscreen-toggle" onClick={onClick}>
      ⭐ Rate Assistant
    </button>
  );
};

export default FeedbackToggle;
