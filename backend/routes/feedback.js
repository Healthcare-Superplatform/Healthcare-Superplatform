const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST route to save feedback
router.post('/', async (req, res) => {
  try {
    console.log('Received feedback request:', req.body);
    const { feedback } = req.body;
    
    if (!feedback || !feedback.trim()) {
      console.log('Empty feedback received');
      return res.status(400).json({ message: 'Feedback cannot be empty' });
    }

    const newFeedback = new Feedback({
      feedback: feedback.trim()
    });

    console.log('Attempting to save feedback:', newFeedback);
    await newFeedback.save();
    console.log('Feedback saved successfully');
    res.status(201).json({ message: 'Feedback saved successfully' });
  } catch (error) {
    console.error('Detailed error saving feedback:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid feedback format' });
    }
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(503).json({ message: 'Database error, please try again later' });
    }
    res.status(500).json({ message: 'Error saving feedback: ' + error.message });
  }
});

// GET route to retrieve all feedback (for testing purposes)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ timestamp: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ message: 'Error retrieving feedback' });
  }
});

module.exports = router;
