import React, { useState, useEffect, useRef } from "react";
import Chatbox from "./AIHealthAssistant/Chatbox";
import ChatInput from "./AIHealthAssistant/ChatInput";
import { isGreeting, getGreetingResponse } from "./AIHealthAssistant/greetingResponses";
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
  const voicesRef = useRef([]);

  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = speechSynthesis.getVoices();
    };
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speakText = (htmlText) => {
    const plainText = htmlText
      .replace(/<[^>]+>/g, "")
      .replace(/[^\w\s.,!?\n]/g, "")
      .replace(/\n+/g, "\n")
      .replace(/\s+/g, " ")
      .trim();

    const withPauses = plainText.split(/(?<=[.!?])\s+/).join(".\n\n");

    const utterance = new SpeechSynthesisUtterance(withPauses);
    utterance.lang = "en-US";
    utterance.rate = 0.85;

    const femaleVoice =
      voicesRef.current.find((v) => /female|woman|zira|susan|samantha/i.test(v.name)) ||
      voicesRef.current.find((v) => v.name.toLowerCase().includes("en"));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const handleInfoClick = (type) => {
    setActiveInfoBox((prev) => (prev === type ? null : type));
  };

  const showInstructionContent = (type) => {
    let text = "";

    if (type === "how") {
      text = `
        <ul>
          <li>Enter your SSN to access hospital info.</li>
          <li>Ask for Health info to access health status.</li>
          <li>Ask for records to access medical records.</li>
          <li>Type symptoms or check symptoms to use the Symptom Checker.</li>
          <li>Ask for medicine suggestions for a specific disease.</li>
        </ul>`;
    } else if (type === "about") {
      text = `<p>This AI chatbot helps you check symptoms, view records, get medicine suggestions, and more. Voice and multilingual support is included.</p>`;
    } else if (type === "features") {
      text = `
        <ul>
          <li>✅ SSN-based hospital info.</li>
          <li>✅ Medical record viewer.</li>
          <li>✅ Health status display.</li>
          <li>✅ Symptom checker + follow-ups.</li>
          <li>✅ Triage and explanation engine.</li>
          <li>✅ Medicine lookup.</li>
          <li>✅ Voice & multilingual input.</li>
          <li>✅ Keyword search & Q&A.</li>
          <li>✅ Feedback system.</li>
        </ul>`;
    }

    setMessages((prev) => [...prev, { sender: "bot", type: "text", text }]);
    speakText(text);
  };

  const handleUserMessage = async () => {
    const userInput = input.trim();
    if (!userInput) return;

    setMessages((prev) => [...prev, { sender: "user", type: "text", text: userInput }]);
    setInput("");

    const lowerInput = userInput.toLowerCase();

    if (lowerInput === "stop") {
      speechSynthesis.cancel();
      return;
    }

    if (["how to use", "how can i use you", "how to use you",
     "how you are effective", "which way i can use you", 
     "what is the way to drive you", "what is the way to use you",
     "how can drive you", "how can i drive you", "which way you are effective"].some((kw) => lowerInput.includes(kw))) {
      showInstructionContent("how");
      return;
    }

    if (["about chatbot", "about you"].some((kw) => lowerInput.includes(kw))) {
      showInstructionContent("about");
      return;
    }

    if (["features", "feature", "available feature", "available features"].some((kw) => lowerInput.includes(kw))) {
      showInstructionContent("features");
      return;
    }

    const logoutKeywords = ["logout", "log out", "sign out"];
    if (logoutKeywords.some((kw) => lowerInput.includes(kw))) {
      localStorage.clear();
      setLoggedInUser(null);
      setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "✅ You’ve been successfully logged out." }]);
      return;
    }
    const emergencyKeywords = ["emergency", "emergency service", "emergency services", "emergencies"];
if (emergencyKeywords.some((kw) => lowerInput.includes(kw))) {
  setMessages((prev) => [
    ...prev,
    { sender: "bot", type: "text", text: "🚨 Opening Emergency Medical Services..." },
    { sender: "bot", type: "component", component: "emergencyMedicalPage" }
  ]);
  return;
}

    if (isGreeting(lowerInput)) {
      const greetingReply = getGreetingResponse();
      setMessages((prev) => [...prev, { sender: "bot", type: "text", text: greetingReply }]);
      speakText(greetingReply);
      return;
    }
    
    const recordKeywords = ["medical record", "records"];
    const healthKeywords = ["my health", "health info"];

    if (recordKeywords.some((kw) => lowerInput.includes(kw))) {
      if (!loggedInUser) {
        setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "🔐 Please log in to access your medical records." }]);
        setPendingComponent("medicalRecordsPage");
        setShowLogin(true);
        return;
      }
      setMessages((prev) => [...prev, { sender: "bot", type: "component", component: "medicalRecordsPage" }]);
      return;
    }

    if (healthKeywords.some((kw) => lowerInput.includes(kw))) {
      if (!loggedInUser) {
        setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "🔐 Please log in to access your health status." }]);
        setShowLogin(true);
        return;
      }
      fetchHealthStatus(loggedInUser, setMessages);
      return;
    }

    if (lowerInput.includes("symptom")) {
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
      setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "ℹ️ Please specify a disease clearly." }]);
    }
  };

  const handleLoginSuccess = (ssn) => {
    setShowLogin(false);
    setLoggedInUser(ssn);

    if (pendingComponent === "medicalRecordsPage") {
      setMessages((prev) => [...prev, { sender: "bot", type: "component", component: "medicalRecordsPage" }]);
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
                <li>Enter your SSN to access hospital info.</li>
                <li>Ask for Health info to access health status.</li>
                <li>Ask for records to access medical records.</li>
                <li>Type symptoms or check symptoms to use the Symptom Checker.</li>
                <li>Ask for medicine suggestions for a specific disease.</li>
              </ul>
            </div>
          )}

          {activeInfoBox === "about" && (
            <div className="info-box">
              <p>This AI chatbot helps you check symptoms, view records, get medicine suggestions, and more. Voice and multilingual support is included.</p>
            </div>
          )}

          {activeInfoBox === "features" && (
            <div className="info-box">
              <ul>
                <li>✅ SSN-based hospital info.</li>
                <li>✅ Medical record viewer.</li>
                <li>✅ Health status display.</li>
                <li>✅ Symptom checker + follow-ups.</li>
                <li>✅ Triage and explanation engine.</li>
                <li>✅ Medicine lookup.</li>
                <li>✅ Voice & multilingual input.</li>
                <li>✅ Keyword search & Q&A.</li>
                <li>✅ Feedback system.</li>
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
