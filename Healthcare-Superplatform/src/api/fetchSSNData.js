
import axios from "axios";

const fetchSSNData = async (ssn, setMessages) => {
  try {
    const res = await axios.get(
      `http://localhost:5001/own_medical?ssn=${encodeURIComponent(ssn)}`
    );
    const data = res.data;

    if (!data || data.length === 0) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", text: "❌ No medical information found for this SSN." },
      ]);
      return;
    }

    const { Name, "Own Medicals": ownMedicals, Link, Location } = data[0];

    const medicalList = ownMedicals.split(",").map((item) => item.trim());
    const linkList = Link.split(",").map((item) => item.trim());

    let message = `👤 <strong>Name:</strong> ${Name}<br/>📍 <strong>Location:</strong> ${Location}<br/><br/><strong>🩺 Your Own Medicals:</strong><br/>`;
    medicalList.forEach((m, i) => {
      message += `- ${m} (<a href="${linkList[i] || "#"}" target="_blank">Visit</a>)<br/>`;
    });

    const regionRes = await axios.get(
      `http://localhost:5001/medical_list?location=${encodeURIComponent(Location)}`
    );
    const regionHospitals = regionRes.data;

    if (regionHospitals.length > 0) {
      message += `<br/><strong>🏥 Other Medical Facilities in ${Location}:</strong><br/>`;

      regionHospitals.forEach((facility) => {
        const name = facility["Hospital name"];
        const category = facility["Category(Public/private)"] || "Unknown";
        const link = facility["Link"]?.trim() || "Unknown";

        if (name) {
          message += `- <strong>${name}</strong> (${category})`;
          message += link ? ` <a href="${link}" target="_blank">Visit</a><br/>` : "<br/>";
        }
      });
    }

    setMessages((prev) => [...prev, { sender: "bot", type: "text", text: message }]);
  } catch (error) {
    console.error("❌ Error fetching SSN data:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", type: "text", text: "⚠️ Error fetching medical records. Please try again later." },
    ]);
  }
};

export default fetchSSNData;
