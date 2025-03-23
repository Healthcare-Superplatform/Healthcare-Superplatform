const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const symptomsFile = path.join(__dirname, "symptoms.json");
const symptoms = JSON.parse(fs.readFileSync(symptomsFile, "utf8"));

// Utility to generate random accuracy between 50 and 90
function getRandomAccuracy(min = 50, max = 90) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility to adjust accuracy based on age/gender
function adjustAccuracy(condition, age, gender) {
  let accuracy = getRandomAccuracy();

  // Basic logic: keyword-based boost
  const lowerCondition = condition.toLowerCase();

  if (gender === "female") {
    if (lowerCondition.includes("ovary") || lowerCondition.includes("menstrual") || lowerCondition.includes("pregnancy")) {
      accuracy += 5;
    }
  }

  if (gender === "male") {
    if (lowerCondition.includes("prostate") || lowerCondition.includes("testicular")) {
      accuracy += 5;
    }
  }

  if (age > 60) {
    if (lowerCondition.includes("arthritis") || lowerCondition.includes("stroke") || lowerCondition.includes("dementia")) {
      accuracy += 5;
    }
  }

  if (age < 18) {
    if (lowerCondition.includes("adhd") || lowerCondition.includes("asthma") || lowerCondition.includes("autism")) {
      accuracy += 5;
    }
  }

  return Math.min(accuracy, 95); // Cap at 95%
}

// GET /api/symptoms
router.get("/symptoms", (req, res) => {
  res.json(symptoms);
});

// POST /api/parse
router.post("/parse", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text required." });

  const lowerText = text.toLowerCase();
  const matched = symptoms.filter((s) => lowerText.includes(s.name.toLowerCase()));

  if (matched.length === 0) {
    return res.status(404).json({ message: "No symptoms matched." });
  }

  return res.json({
    mentions: matched.map((s) => ({ id: s.id, name: s.name })),
  });
});

// POST /api/diagnosis
router.post("/diagnosis", (req, res) => {
  let {
    symptoms: selectedIds = [],
    answer,
    followUpSymptomId,
    answeredFollowUps = {},
    age = 30,
    gender = "male",
  } = req.body;

  selectedIds = selectedIds.map((id) => parseInt(id));

  // Handle follow-up answer
  if (followUpSymptomId && answer) {
    answeredFollowUps[followUpSymptomId] = answer;

    const nextSymptom = selectedIds.find(
      (id) => !answeredFollowUps[id]
    );

    if (nextSymptom) {
      const symptom = symptoms.find((s) => s.id === nextSymptom);
      if (symptom?.question) {
        return res.json({
          question: {
            text: symptom.question,
            symptom: { id: symptom.id, name: symptom.name },
          },
          answeredFollowUps,
        });
      }
    }

    // All follow-ups answered, generate diagnosis
    let conditions = [];

    Object.entries(answeredFollowUps).forEach(([id, ans]) => {
      const sym = symptoms.find((s) => s.id === parseInt(id));
      if (sym) {
        const rawList = ans === "yes" ? sym.diagnosis_yes : sym.diagnosis_no;

        const diagnoses = Array.isArray(rawList) ? rawList : [rawList];
        diagnoses.forEach((name) => {
          conditions.push({
            name,
            accuracy: adjustAccuracy(name, age, gender),
          });
        });
      }
    });

    return res.json({ conditions });
  }

  // First follow-up to ask
  if (selectedIds.length > 0) {
    const nextSymptom = selectedIds.find(
      (id) => !answeredFollowUps[id]
    );

    if (nextSymptom) {
      const symptom = symptoms.find((s) => s.id === nextSymptom);
      if (symptom?.question) {
        return res.json({
          question: {
            text: symptom.question,
            symptom: { id: symptom.id, name: symptom.name },
          },
          answeredFollowUps,
        });
      }
    }
  }

  // If no follow-ups or already answered, fallback to bulk guess
  const conditionCount = {};
  selectedIds.forEach((id) => {
    const symptom = symptoms.find((s) => s.id === id);
    if (symptom?.diagnosis_yes) {
      const diagnoses = Array.isArray(symptom.diagnosis_yes)
        ? symptom.diagnosis_yes
        : [symptom.diagnosis_yes];

      diagnoses.forEach((d) => {
        conditionCount[d] = (conditionCount[d] || 0) + 1;
      });
    }
  });

  const conditions = Object.entries(conditionCount)
    .map(([name, count]) => ({
      name,
      accuracy: adjustAccuracy(name, age, gender),
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  return res.json({ conditions });
});

// POST /api/triage
router.post("/triage", (req, res) => {
  res.json({
    level: "consultation_recommended",
    description: "You should consult a doctor within 24–48 hours.",
  });
});

// POST /api/explain
router.post("/explain", (req, res) => {
  res.json({
    explanation:
      "Your symptoms and follow-up answers are consistent with our analysis of possible conditions.",
  });
});

module.exports = router;
