import React, { useState, useEffect, useRef } from "react";

// Converts number words like "one zero seven" → "107"
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

  // Replace each word if it's a number word
  const converted = words.map((word) => {
    const lower = word.toLowerCase();
    return numbersMap[lower] !== undefined ? numbersMap[lower] : word;
  });

  return converted.join(" ");
};

const ChatInput = ({ input, setInput, onSend }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const inputBoxRef = useRef(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      transcriptRef.current = "";
      console.log("🎙️ Voice recognition started");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      transcriptRef.current += " " + transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      console.log("🎤 Voice recognition ended");
      setListening(false);

      let finalText = transcriptRef.current.trim();
      finalText = numberWordsToDigits(finalText); // ✅ convert number words

      if (finalText) {
        setInput(finalText);

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
      }
    };

    recognitionRef.current = recognition;
  }, [setInput, onSend]);

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
      <input
        ref={inputBoxRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or speak..."
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <button onClick={onSend}>Send</button>
      <button onClick={toggleListening} title="Voice Input" style={{ marginLeft: "8px" }}>
        {listening ? "🎙️ Listening..." : "🎤"}
      </button>
    </div>
  );
};

export default ChatInput;
