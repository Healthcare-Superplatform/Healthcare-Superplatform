import React, { useState } from "react";
import Chatbox from "./AIHealthAssistant/Chatbox";
import ChatInput from "./AIHealthAssistant/ChatInput";
import FeedbackToggle from "./AIHealthAssistant/FeedbackToggle";
import Login from "../pages/Login";
import Feedback from "./Feedback";
import extractDiseaseName from "../utils/extractDiseaseName";
import fetchSSNData from "../api/fetchSSNData";
import fetchMedicineData from "../api/fetchMedicineData";
import fetchHealthStatus from "../api/fetchHealthStatus";
import "../styles/AIHealthAssistant.css";

const AIHealthAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      type: "text",
      text: `<div style="text-align: center;">🤖 <strong>Hi! How can I help you today?</strong></div><br/>
      <span style="color:#2c3e50;"><strong>Now I am available for the following services:</strong></span><br/><br/>
      ➤ <strong><span style="color:#16a085;">Enter your SSN</span></strong> to get <strong>Healthcare & Hospital Info</strong><br/>
      ➤ <strong><span style="color:#2980b9;">Type "Check symptoms"</span></strong> to access the <strong>Symptom Checker</strong><br/>
      ➤ <strong><span style="color:#8e44ad;">Ask about a disease</span></strong> or just provide a <strong>keyword</strong> to get <strong>medicine suggestions</strong>`,
    },
  ]);
  const [showFeedbackOnly, setShowFeedbackOnly] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [pendingComponent, setPendingComponent] = useState(null);

  const handleUserMessage = async () => {
    const userInput = input.trim();
    if (!userInput) return;

    setMessages((prev) => [...prev, { sender: "user", type: "text", text: userInput }]);
    setInput("");

    const lowerInput = userInput.toLowerCase();

    const recordKeywords = ["medical record", "medical records", "record", "records"];
    const healthKeywords = ["my health", "health info"];

    if (recordKeywords.some((kw) => lowerInput.includes(kw))) {
      if (!loggedInUser) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            type: "text",
            text: "🔐 Please log in with your SSN and password to access your medical records.",
          },
        ]);
        setPendingComponent("medicalRecordsPage");
        setShowLogin(true);
        return;
      }

      // Already logged in, show Medical Records Page inside chat
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "component",
          component: "medicalRecordsPage",
        },
      ]);
      return;
    }

    if (healthKeywords.some((kw) => lowerInput.includes(kw))) {
      if (!loggedInUser) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            type: "text",
            text: "🔐 Please log in with your SSN and password to access your health status.",
          },
        ]);
        setShowLogin(true);
        return;
      }

      fetchHealthStatus(loggedInUser, setMessages);
      return;
    }

    if (
      lowerInput.includes("symptom") ||
      lowerInput.includes("check symptoms") ||
      lowerInput.includes("open symptom checker")
    ) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", text: "🩺 Opening Symptom Checker..." },
        { sender: "bot", type: "component", component: "symptomChecker" },
      ]);
      return;
    }

    const ssnMatch = userInput.match(/\b\d{3}-\d{2}-\d{4}\b|\b\d{1,9}\b/);
    if (ssnMatch) {
      await fetchSSNData(ssnMatch[0], setMessages);
      return;
    }

    const diseaseName = extractDiseaseName(userInput);
    if (diseaseName) {
      await fetchMedicineData(diseaseName, setMessages);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          text: "ℹ️ Please specify a disease clearly.",
        },
      ]);
    }
  };

  const handleLoginSuccess = (ssn) => {
    setShowLogin(false);
    setLoggedInUser(ssn);

    // If login was triggered for a component, show it now
    if (pendingComponent === "medicalRecordsPage") {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "component",
          component: "medicalRecordsPage",
        },
      ]);
      setPendingComponent(null);
    } else {
      fetchHealthStatus(ssn, setMessages);
    }
  };

  if (showFeedbackOnly) {
    return (
      <div className="ai-health-feedback-view">
        <Feedback />
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button onClick={() => setShowFeedbackOnly(false)} style={{ padding: "8px 16px" }}>
            ← Back to Chatbot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-health-assistant">
      <h2>🤖 AI Health Assistant Chatbot</h2>
      <Chatbox messages={messages} />
      <div className="user-input">
        {showLogin ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <ChatInput input={input} setInput={setInput} onSend={handleUserMessage} />
        )}
      </div>
      <FeedbackToggle onClick={() => setShowFeedbackOnly(true)} />
    </div>
  );
};

export default AIHealthAssistant;
