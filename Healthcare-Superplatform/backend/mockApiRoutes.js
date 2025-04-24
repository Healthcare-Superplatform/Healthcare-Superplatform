const express = require("express");
const mongoose = require("mongoose");
const Symptom = require("./models/Symptom");

const router = express.Router();

// Utility to generate random accuracy between 50 and 90
function getRandomAccuracy(min = 50, max = 90) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility to adjust accuracy based on age/gender
function adjustAccuracy(condition, age, gender) {
  let accuracy = getRandomAccuracy();
  const lowerCondition = condition.toLowerCase();

  if (gender === "female" && (lowerCondition.includes("ovary") || lowerCondition.includes("menstrual") || lowerCondition.includes("pregnancy"))) {
    accuracy += 5;
  }

  if (gender === "male" && (lowerCondition.includes("prostate") || lowerCondition.includes("testicular"))) {
    accuracy += 5;
  }

  if (age > 60 && (lowerCondition.includes("arthritis") || lowerCondition.includes("stroke") || lowerCondition.includes("dementia"))) {
    accuracy += 5;
  }

  if (age < 18 && (lowerCondition.includes("adhd") || lowerCondition.includes("asthma") || lowerCondition.includes("autism"))) {
    accuracy += 5;
  }

  return Math.min(accuracy, 95);
}

// GET /api/symptoms
router.get("/symptoms", async (req, res) => {
  try {
    const symptoms = await Symptom.find();
    res.json(symptoms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch symptoms." });
  }
});

// POST /api/parse
router.post("/parse", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text required." });

  try {
    const allSymptoms = await Symptom.find();
    const lowerText = text.toLowerCase();
    const matched = allSymptoms.filter((s) => lowerText.includes(s.name.toLowerCase()));

    if (matched.length === 0) {
      return res.status(404).json({ message: "No symptoms matched." });
    }

    return res.json({
      mentions: matched.map((s) => ({ id: s.id, name: s.name })),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to parse symptoms." });
  }
});

// POST /api/diagnosis
router.post("/diagnosis", async (req, res) => {
  let {
    symptoms: selectedIds = [],
    answer,
    followUpSymptomId,
    answeredFollowUps = {},
    age = 30,
    gender = "male",
  } = req.body;

  selectedIds = selectedIds.map((id) => parseInt(id));

  try {
    if (followUpSymptomId && answer) {
      answeredFollowUps[followUpSymptomId] = answer;

      const nextSymptom = selectedIds.find((id) => !answeredFollowUps[id]);
      if (nextSymptom) {
        const symptom = await Symptom.findOne({ id: nextSymptom });
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

      let conditions = [];
      for (const [id, ans] of Object.entries(answeredFollowUps)) {
        const sym = await Symptom.findOne({ id: parseInt(id) });
        if (sym) {
          const diagnoses = ans === "yes" ? sym.diagnosis_yes : sym.diagnosis_no;
          diagnoses.forEach((name) => {
            conditions.push({
              name,
              accuracy: adjustAccuracy(name, age, gender),
            });
          });
        }
      }

      return res.json({ conditions });
    }

    if (selectedIds.length > 0) {
      const nextSymptom = selectedIds.find((id) => !answeredFollowUps[id]);
      if (nextSymptom) {
        const symptom = await Symptom.findOne({ id: nextSymptom });
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

    const conditionCount = {};
    for (const id of selectedIds) {
      const symptom = await Symptom.findOne({ id });
      if (symptom?.diagnosis_yes) {
        const diagnoses = Array.isArray(symptom.diagnosis_yes)
          ? symptom.diagnosis_yes
          : [symptom.diagnosis_yes];

        diagnoses.forEach((d) => {
          conditionCount[d] = (conditionCount[d] || 0) + 1;
        });
      }
    }

    const conditions = Object.entries(conditionCount)
      .map(([name, count]) => ({
        name,
        accuracy: adjustAccuracy(name, age, gender),
      }))
      .sort((a, b) => b.accuracy - a.accuracy);

    return res.json({ conditions });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate diagnosis." });
  }
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
