
const extractDiseaseName = (text) => {
  if (!text) return null;
  text = text.toLowerCase().trim();

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
    "how"
  ];

  phrasesToRemove.forEach((phrase) => {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi");
    text = text.replace(regex, "");
  });

  text = text.replace(/[^\w\s]/gi, "").replace(/\s{2,}/g, " ").trim();
  return text.length > 2 ? text : null;
};

export default extractDiseaseName;
