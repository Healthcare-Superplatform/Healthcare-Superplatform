
import info from "../components/info.json";

const fetchHealthStatus = (user, setMessages) => {
  try {
    const userSSN = user.SSN || user;
    const userData = info.find((data) => data.SSN === userSSN);

    if (!userData) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", text: "❌ No health information found for your account." },
      ]);
      return;
    }

    const {
      BMI,
      HeartRate_BPM,
      BloodPressure_mmHg,
      OxygenSaturation_SpO2,
      DailySteps,
      SleepHours,
      Medication,
      HealthGoals,
      LastUpdated,
    } = userData;

    let message = `🩺 <strong>Health Status:</strong><br/>`;
    message += `• <strong>BMI:</strong> ${BMI}<br/>`;
    message += `• <strong>Heart Rate (BPM):</strong> ${HeartRate_BPM}<br/>`;
    message += `• <strong>Blood Pressure:</strong> ${BloodPressure_mmHg}<br/>`;
    message += `• <strong>Oxygen Saturation (SpO2):</strong> ${OxygenSaturation_SpO2}%<br/>`;
    message += `• <strong>Daily Steps:</strong> ${DailySteps}<br/>`;
    message += `• <strong>Sleep Hours:</strong> ${SleepHours} hours<br/>`;
    message += `• <strong>Medication:</strong> ${Medication.length > 0 ? Medication.join(", ") : "None"}<br/>`;
    message += `• <strong>Health Goals:</strong><br/>`;
    message += `   - Weight Goal: ${HealthGoals.WeightGoal_kg} kg<br/>`;
    message += `   - Daily Step Goal: ${HealthGoals.DailyStepGoal}<br/>`;
    message += `   - Sleep Goal: ${HealthGoals.SleepGoal_Hours} hours<br/>`;
    message += `• <strong>Last Updated:</strong> ${LastUpdated}<br/>`;

    setMessages((prev) => [...prev, { sender: "bot", type: "text", text: message }]);
  } catch (error) {
    console.error("❌ Error fetching health status:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", type: "text", text: "⚠️ Error fetching health status. Please try again later." },
    ]);
  }
};

export default fetchHealthStatus;
