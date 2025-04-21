const extractDiseaseName = (text) => {
  if (!text) return null;

  text = text.toLowerCase().trim();

  // ✅ Expandable pattern-based cleanup
  const phrasesToRemove = [
    "what medicine should i take for",
    "what medicine can i take for",
    "what should i take for",
    "which medicine should i take for",
    "which medicine can i take for",
    "which medicine for",
    "can you help me with",
    "could you help me with",
    "please help me with",
    "can you help me for",
    "could you help me for",
    "please help me for",
    "help me with",
    "help me for",
    "help me",
    "can you",
    "could you",
    "may i",
    "can i",
    "should i",
    "i want",
    "i need",
    "need",
    "want",
    "please",
    "what medicine",
    "which medicine",
    "how to treat",
    "give me",
    "i have",
    "recommend",
    "suggest",
    "medicine for",
    "medicine",
    "medicines",
    "drugs",
    "drug",
    "for",
    "is",
    "with",
    "about",
    "take",
    "needed",
    "necessary",
    "use",
    "must",
    "get",
    "what",
    "how",
  ];

  phrasesToRemove.forEach((phrase) => {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi");
    text = text.replace(regex, " ");
  });

  // 🧼 Clean up punctuation and double spaces
  text = text.replace(/[^\w\s]/gi, "").replace(/\s{2,}/g, " ").trim();

  // ✅ Only return if there's something meaningful
  return text.length > 1 ? text : null;
};

export default extractDiseaseName;
