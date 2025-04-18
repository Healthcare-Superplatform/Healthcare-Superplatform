const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST route to save feedback
router.post('/', async (req, res) => {
  try {
    console.log('Received feedback request:', JSON.stringify(req.body, null, 2));
    const { feedback, rating, category } = req.body;
    
    console.log('Parsed values:', {
      feedback: typeof feedback,
      rating: typeof rating,
      category: typeof category,
      ratingValue: rating,
      categoryValue: category
    });

    if (!feedback || !feedback.trim()) {
      console.log('Empty feedback received');
      return res.status(400).json({ message: 'Feedback cannot be empty' });
    }

    if (!rating || rating < 1 || rating > 5) {
      console.log('Invalid rating received:', rating);
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!category) {
      console.log('Missing category');
      return res.status(400).json({ message: 'Category is required' });
    }

    // Check if category is one of the allowed values
    const validCategories = ['Very Bad', 'Bad', 'Good', 'Very Good', 'Best'];
    if (!validCategories.includes(category)) {
      console.log('Invalid category:', category);
      return res.status(400).json({ 
        message: 'Invalid category. Must be one of: ' + validCategories.join(', ')
      });
    }

    const newFeedback = new Feedback({
      feedback: feedback.trim(),
      rating: Number(rating),
      category
    });

    console.log('Attempting to save feedback:', newFeedback);
    await newFeedback.save();
    console.log('Feedback saved successfully');
    
    // Calculate new average after saving
    const result = await Feedback.aggregate([
      { $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalCount: { $sum: 1 }
      }}
    ]);
    
    const averageRating = result[0]?.averageRating || 0;
    const totalCount = result[0]?.totalCount || 0;
    
    res.status(201).json({
      message: 'Feedback saved successfully',
      averageRating: Number(averageRating.toFixed(2)),
      totalCount
    });
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

// GET route to retrieve average rating
router.get('/average', async (req, res) => {
  try {
    const result = await Feedback.aggregate([
      { $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalCount: { $sum: 1 }
      }}
    ]);
    
    const averageRating = result[0]?.averageRating || 0;
    const totalCount = result[0]?.totalCount || 0;
    
    res.json({
      averageRating: Number(averageRating.toFixed(2)),
      totalCount
    });
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).json({ message: 'Error calculating average rating' });
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
