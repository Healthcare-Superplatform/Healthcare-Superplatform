import React, { useEffect, useState } from "react";
import axios from "axios";

const SymptomChecker = () => {
  const [symptomsList, setSymptomsList] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState("male");
  const [diagnosis, setDiagnosis] = useState([]);
  const [triage, setTriage] = useState(null);
  const [question, setQuestion] = useState(null);
  const [freeText, setFreeText] = useState("");
  const [followUpSymptomId, setFollowUpSymptomId] = useState(null);
  const [answeredFollowUps, setAnsweredFollowUps] = useState({});
  const [explanation, setExplanation] = useState("");
  const [matchedSymptomIds, setMatchedSymptomIds] = useState([]);
  const [highlightedIds, setHighlightedIds] = useState([]);

  useEffect(() => {
    axios.get("/api/symptoms").then((res) => setSymptomsList(res.data));
  }, []);

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const parseFreeText = () => {
    const input = freeText.toLowerCase().trim();
    const inputWords = input.split(/\s+/);
    const matchedIds = [];
    const highlights = [];
  
    symptomsList.forEach((symptom) => {
      const name = symptom.name.toLowerCase();
  
      // Full match on symptom name (even multi-word match)
      if (input.includes(name)) {
        matchedIds.push(symptom.id);
      }
  
      // Partial match on individual words (min 2 letters)
      for (let word of inputWords) {
        if (word.length >= 2 && name.includes(word)) {
          highlights.push(symptom.id);
          break;
        }
      }
    });
  
    setSelectedSymptoms((prev) => [...new Set([...prev, ...matchedIds])]);
    setMatchedSymptomIds(matchedIds);
    setHighlightedIds(highlights);
  };
  

  const getDiagnosis = async () => {
    const res = await axios.post("/api/diagnosis", {
      age,
      gender,
      symptoms: selectedSymptoms,
      answeredFollowUps,
    });

    if (res.data.question) {
      setQuestion(res.data.question);
      setFollowUpSymptomId(res.data.question.symptom.id);
      setDiagnosis([]);
      setAnsweredFollowUps(res.data.answeredFollowUps || {});
    } else {
      setDiagnosis(res.data.conditions || []);
      setQuestion(null);
      setFollowUpSymptomId(null);
      getTriage();
      getExplanation();
    }
  };

  const answerFollowUp = async (ans) => {
    const updatedAnswers = {
      ...answeredFollowUps,
      [followUpSymptomId]: ans,
    };

    const res = await axios.post("/api/diagnosis", {
      symptoms: selectedSymptoms,
      answer: ans,
      followUpSymptomId,
      answeredFollowUps: updatedAnswers,
    });

    if (res.data.question) {
      setQuestion(res.data.question);
      setFollowUpSymptomId(res.data.question.symptom.id);
      setDiagnosis([]);
      setAnsweredFollowUps(res.data.answeredFollowUps || updatedAnswers);
    } else {
      setDiagnosis(res.data.conditions || []);
      setQuestion(null);
      setFollowUpSymptomId(null);
      setAnsweredFollowUps(updatedAnswers);
      getTriage();
      getExplanation();
    }
  };

  const getTriage = async () => {
    const res = await axios.post("/api/triage", {
      age,
      gender,
      symptoms: selectedSymptoms,
    });
    setTriage(res.data);
  };

  const getExplanation = async () => {
    const res = await axios.post("/api/explain", {
      symptoms: selectedSymptoms,
    });
    setExplanation(res.data.explanation);
  };

  // Sort symptom list: matched symptoms first
  const sortedSymptoms = [...symptomsList].sort((a, b) => {
    const aMatch = matchedSymptomIds.includes(a.id) ? -1 : 0;
    const bMatch = matchedSymptomIds.includes(b.id) ? -1 : 0;
    return aMatch - bMatch;
  });

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>🩺 Symptom Checker</h2>

      <div>
        <label>Age: </label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(+e.target.value)}
        />
        <label style={{ marginLeft: 20 }}>Gender: </label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>🗣️ Type your symptoms (free text)</h4>
        <input
          type="text"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="e.g. I have nausea and headache"
        />
        <button onClick={parseFreeText} style={{ marginLeft: 10 }}>
          Search
        </button>
      </div>

      <h4>📋 Select Symptoms</h4>
      <ul
        style={{
          maxHeight: 200,
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: 10,
        }}
      >
        {sortedSymptoms.map((symptom) => (
          <li
            key={symptom.id}
            style={{
              backgroundColor: highlightedIds.includes(symptom.id)
                ? "#ffffcc"
                : "transparent",
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom.id)}
                onChange={() => toggleSymptom(symptom.id)}
              />
              {symptom.name}
            </label>
          </li>
        ))}
      </ul>

      <button onClick={getDiagnosis} style={{ marginTop: 20 }}>
        Get Diagnosis
      </button>

      {question && (
        <div style={{ marginTop: 20 }}>
          <h4>❓ Follow-up Question:</h4>
          <p>{question.text}</p>
          <button onClick={() => answerFollowUp("yes")}>Yes</button>
          <button onClick={() => answerFollowUp("no")} style={{ marginLeft: 10 }}>
            No
          </button>
        </div>
      )}

      {diagnosis.length > 0 && (
        <div>
          <h3>🧠 Possible Conditions:</h3>
          <ul>
            {diagnosis.map((d, i) => (
              <li key={i}>
                {d.name} — Accuracy: {d.accuracy || "?"}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {triage && (
        <div>
          <h3>🚨 Triage Advice:</h3>
          <p>{triage.description}</p>
        </div>
      )}

      {explanation && (
        <div>
          <h3>🧾 Reasoning:</h3>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
