import React from "react";

const FeedbackToggle = ({ onClick }) => {
  const buttonStyle = {
    position: "fixed",
    bottom: "12px",
    right: "12px",
    backgroundColor: "#ff9800",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "20px",
    fontWeight: "500",
    fontSize: "14px",
    boxShadow: "0 0 8px rgba(0,0,0,0.15)",
    zIndex: 999,
    cursor: "pointer",
    transition: "transform 0.2s ease",
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = "scale(1.05)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      ⭐ Rate Assistant
    </button>
  );
};

export default FeedbackToggle;
