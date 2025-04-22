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
  const [messages, setMessages] = useState([]);
  const [showFeedbackOnly, setShowFeedbackOnly] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [pendingComponent, setPendingComponent] = useState(null);
  const [activeInfoBox, setActiveInfoBox] = useState(null);

  const handleInfoClick = (type) => {
    setActiveInfoBox((prev) => (prev === type ? null : type));
  };

  const handleUserMessage = async () => {
    const userInput = input.trim();
    if (!userInput) return;

    setMessages((prev) => [...prev, { sender: "user", type: "text", text: userInput }]);
    setInput("");

    const lowerInput = userInput.toLowerCase();

    const logoutKeywords = ["logout", "log out", "sign out"];
    if (logoutKeywords.some((kw) => lowerInput.includes(kw))) {
      localStorage.clear();
      setLoggedInUser(null);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", text: "✅ You’ve been successfully logged out." },
      ]);
      return;
    }

    const recordKeywords = ["medical record", "records"];
    const healthKeywords = ["my health", "health info"];

    if (recordKeywords.some((kw) => lowerInput.includes(kw))) {
      if (!loggedInUser) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "text", text: "🔐 Please log in to access your medical records." },
        ]);
        setPendingComponent("medicalRecordsPage");
        setShowLogin(true);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "component", component: "medicalRecordsPage" },
      ]);
      return;
    }

    if (healthKeywords.some((kw) => lowerInput.includes(kw))) {
      if (!loggedInUser) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "text", text: "🔐 Please log in to access your health status." },
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
        { sender: "bot", type: "text", text: "ℹ️ Please specify a disease clearly." },
      ]);
    }
  };

  const handleLoginSuccess = (ssn) => {
    setShowLogin(false);
    setLoggedInUser(ssn);

    if (pendingComponent === "medicalRecordsPage") {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "component", component: "medicalRecordsPage" },
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
          <button onClick={() => setShowFeedbackOnly(false)}>← Back to Chatbot</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-health-assistant">
      <h2>🤖 AI Health Assistant Chatbot</h2>

      {/* Initial Instructional Message */}
      <div className="instruction-box">
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <strong>Hi! How can I help you today?</strong>
        </div>
        <div>
          <strong>Instructions:</strong>
          <div className="button-group">
            <button className="info-btn" onClick={() => handleInfoClick("how")}>📘 How to use</button>
            <button className="info-btn" onClick={() => handleInfoClick("about")}>ℹ️ About chatbot</button>
            <button className="info-btn" onClick={() => handleInfoClick("features")}>🛠 Available features</button>
          </div>

          {activeInfoBox === "how" && (
            <div className="info-box">
              <ul>
                <li>Enter your SSN to access health hospital info.</li>
                <li>ask for Health info to access health status</li>
                <li>ask for records to access medical records</li>
                <li>Type symptoms or check symptoms to use the Symptom Checker.</li>
                <li>Ask for medicine suggestions for a specific disease.</li>
              </ul>
            </div>
          )}

          {activeInfoBox === "about" && (
            <div className="info-box">
              <p>
                This AI chatbot assists with checking symptoms, viewing health records,
                shows present health status, suggesting medicines, and giving medical triage advice. Voice and language
                support included. Also search by keywords or ask questions.
              </p>
            </div>
          )}

          {activeInfoBox === "features" && (
            <div className="info-box">
              <ul>
                <li>✅ SSN-based hospital info</li>
                <li>✅ SSN-based medical record check</li>
                <li>✅ Present health status check</li>
                <li>✅ Symptom checker and follow-up questions</li>
                <li>✅ Triage and explanation engine</li>
                <li>✅ Medicine suggestions</li>
                <li>✅ Multi-language & voice input</li>
                <li>✅ Search by keyword or ask questions</li>
                <li>✅ Enhanced feedback system</li>
              </ul>
            </div>
          )}
        </div>
      </div>

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
