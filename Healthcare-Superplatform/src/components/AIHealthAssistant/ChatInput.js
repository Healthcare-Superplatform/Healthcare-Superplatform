import React, { useState, useEffect, useRef } from "react";

// 🔠 Convert number words like "one zero seven" → "107"
const numberWordsToDigits = (text) => {
  const numbersMap = {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    ten: "10",
  };

  const words = text.split(/\s+/);
  return words
    .map((word) => {
      const lower = word.toLowerCase();
      return numbersMap[lower] !== undefined ? numbersMap[lower] : word;
    })
    .join(" ");
};

// 🌍 Set a reliable LibreTranslate instance
const API_BASE = "https://translate.astian.org";

// 🌍 Detect the source language from text
const detectLanguage = async (text) => {
  try {
    const res = await fetch(`${API_BASE}/detect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text }),
    });

    const data = await res.json();
    return data[0]?.language || "auto";
  } catch (err) {
    console.error("Language detection failed:", err);
    return "auto";
  }
};

// 🌐 Translate any language → English
const translateToEnglish = async (text) => {
  const sourceLang = await detectLanguage(text);

  try {
    // Try LibreTranslate first
    const libreRes = await fetch("https://translate.astian.org/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: "en",
        format: "text",
      }),
    });

    const libreData = await libreRes.json();
    if (libreData?.translatedText && libreData.translatedText !== text) {
      return libreData.translatedText;
    }
  } catch (err) {
    console.warn("LibreTranslate failed:", err.message);
  }

  try {
    // 🔄 Fallback to unofficial Google Translate API
    const googleRes = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(
        text
      )}`
    );
    const googleData = await googleRes.json();
    return googleData[0]?.map((seg) => seg[0]).join("") || text;
  } catch (err) {
    console.error("Google fallback failed:", err.message);
    return text;
  }
};

const ChatInput = ({ input, setInput, onSend }) => {
  const [listening, setListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en-US");
  const recognitionRef = useRef(null);
  const inputBoxRef = useRef(null);
  const transcriptRef = useRef("");
  const silenceTimer = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang; // 🌍 Dynamic language support
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const resetSilenceTimer = () => {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
        recognition.stop(); // Stop after 3.5s of silence
      }, 3500);
    };

    recognition.onstart = () => {
      transcriptRef.current = "";
      resetSilenceTimer();
      console.log("🎙️ Voice recognition started");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      transcriptRef.current += " " + transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
      resetSilenceTimer();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      clearTimeout(silenceTimer.current);
    };

    recognition.onend = async () => {
      clearTimeout(silenceTimer.current);
      setListening(false);

      let finalText = transcriptRef.current.trim();
      if (!finalText) return;

      // 🌍 Translate → 🔢 Convert → ⏎ Submit
      const translated = await translateToEnglish(finalText);
      const processedText = numberWordsToDigits(translated);

      setInput(processedText);

      setTimeout(() => {
        if (inputBoxRef.current) {
          const enterEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            bubbles: true,
          });
          inputBoxRef.current.dispatchEvent(enterEvent);
        }
      }, 200);
    };

    recognitionRef.current = recognition;
  }, [setInput, onSend, selectedLang]);

  const startListening = () => {
    if (!listening && recognitionRef.current) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (listening) stopListening();
    else startListening();
  };

  return (
    <div className="chat-input">
      <div style={{ marginBottom: "0.5rem" }}>
        <label htmlFor="language-select">🎙️ Voice Language: </label>
        <select
          id="language-select"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
        >
          <option value="en-US">English</option>
          <option value="bn-BD">Bangla</option>
          <option value="hi-IN">Hindi</option>
          <option value="ur-PK">Urdu</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
        </select>
      </div>

      <input
        ref={inputBoxRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or speak..."
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <button onClick={onSend}>Send</button>
      <button
        onClick={toggleListening}
        title="Voice Input"
        style={{ marginLeft: "8px" }}
      >
        {listening ? "🎙️ Listening..." : "🎤"}
      </button>
    </div>
  );
};

export default ChatInput;
