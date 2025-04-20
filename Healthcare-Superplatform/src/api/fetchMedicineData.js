
import axios from "axios";

const fetchMedicineData = async (diseaseName, setMessages) => {
  try {
    const res = await axios.get(
      `http://localhost:5001/search_medicine?disease=${encodeURIComponent(diseaseName)}`
    );
    const medicines = res.data;

    if (!Array.isArray(medicines) || medicines.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          text: `ℹ️ No medicines found for "${diseaseName}".`,
        },
      ]);
      return;
    }

    const limitWords = (str, maxWords = 20) => {
      const words = str.split(" ");
      return words.slice(0, maxWords).join(" ") + (words.length > maxWords ? "..." : "");
    };

    let text = `💊 <strong>Medicines for ${diseaseName}:</strong><br/><br/>`;
    medicines.forEach((med, index) => {
      text += `${index + 1}. <strong>${med.name}</strong><br/>`;
      text += `- Manufacturer: ${med.manufacturer}<br/>`;
      text += `- Substance: ${med.substance_name}<br/>`;
      text += `- Description: ${limitWords(med.description)}<br/><br/>`;
    });

    setMessages((prev) => [...prev, { sender: "bot", type: "text", text }]);
  } catch (error) {
    console.error("❌ Error fetching medicines:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", type: "text", text: "⚠️ Error fetching medicines. Please try again later." },
    ]);
  }
};

export default fetchMedicineData;
