import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Feedback.css';
import StarRating from './StarRating.js';
import FeedbackCategory from './FeedbackCategory.js';

const getCategoryLabel = (rating) => {
  if (!rating || rating < 1 || rating > 5) return '';
  
  switch (Math.round(rating)) {
    case 1: return "Very Bad";
    case 2: return "Bad";
    case 3: return "Good";
    case 4: return "Very Good";
    case 5: return "Best";
    default: return "";
  }
};

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [showFeedbackForm, setShowFeedbackForm] = useState(true);

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get('/api/feedback/average', {
        baseURL: 'http://localhost:5001'
      });
      setAverageRating(response.data.averageRating);
      setTotalFeedbacks(response.data.totalCount);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  // Fetch average rating on component mount
  React.useEffect(() => {
    fetchAverageRating();
  }, []);

  const resetForm = () => {
    setRating(0);
    setFeedback('');
    setShowFeedbackForm(false);
    // Show new feedback form after a short delay
    setTimeout(() => setShowFeedbackForm(true), 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setMessage('Please provide a star rating before submitting.');
      return;
    }

    if (!feedback.trim()) {
      setMessage('Please enter feedback before submitting');
      return;
    }

    try {
      const roundedRating = Math.round(rating);
      const category = getCategoryLabel(roundedRating);
      
      console.log('Debug info:', {
        originalRating: rating,
        roundedRating,
        category,
        feedback,
        feedbackLength: feedback?.length,
        feedbackTrimmed: feedback?.trim()?.length
      });
      
      if (!category) {
        setMessage('Invalid rating category. Please try again.');
        return;
      }

      const payload = {
        feedback: feedback.trim(),
        rating: roundedRating,
        category,
        timestamp: new Date()
      };
      console.log('Request payload:', payload);
      
      const response = await axios.post('/api/feedback', payload, {
        baseURL: 'http://localhost:5001',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Server response:', response);

      if (response.status === 201) {
        setMessage('Thank you for your feedback!');
        setAverageRating(response.data.averageRating);
        setTotalFeedbacks(response.data.totalCount);
        resetForm();
      }
    } catch (error) {
      const errorDetails = {
        data: error.response?.data,
        status: error.response?.status,
        message: error.message,
        validationError: error.response?.data?.message
      };
      console.error('Error details:', errorDetails);
      
      // Set a more specific error message
      const errorMessage = error.response?.data?.message || 
                         'Error submitting feedback. Please try again.';
      setMessage(errorMessage);
    }
  };

  const getFeedbackPlaceholder = () => {
    if (rating === 0) return "Please rate our AI assistant using the stars above first...";
    
    const category = getCategoryLabel(rating);
    switch (category) {
      case "Very Bad":
        return "We're sorry to hear about your experience. Could you tell us what went wrong and how we can improve?";
      case "Bad":
        return "We appreciate your feedback. Please share what aspects need improvement.";
      case "Good":
        return "Thanks for your rating. What did we do well, and what could we improve?";
      case "Very Good":
        return "We're glad you had a positive experience! Please share what you liked about our AI assistant.";
      case "Best":
        return "Thank you for your excellent rating! We'd love to hear what made your experience so great.";
      default:
        return "Please share your feedback about our AI assistant...";
    }
  };

  const renderAIAnalysisSection = () => {
    return (
      <div className="ai-analysis-section">
        <h3>How AI Can Utilize This Feedback</h3>
        <ul>
          <li>Personalized responses based on user preferences identified through feedback</li>
          <li>Improvement of response accuracy using categorized feedback data</li>
          <li>Refinement of AI conversation flow based on user satisfaction levels</li>
          <li>Development of new features prioritized by user feedback categories</li>
          <li>Enhanced healthcare-specific vocabulary and knowledge based on domain feedback</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="feedback-container">
      <h2>Rate Our Assistant</h2>
      <p className="feedback-description">Your feedback helps us improve our healthcare AI services</p>
      
      {averageRating > 0 && (
        <div className="average-rating">
          <p>Average Rating: <strong>{averageRating.toFixed(1)}</strong>/5</p>
          <p>Total Feedbacks: {totalFeedbacks}</p>
        </div>
      )}
      
      {showFeedbackForm && (
        <>
          <div className="rating-section">
            <div className="rating-display">
              <p>Your Rating:</p>
              <StarRating rating={rating} onChange={setRating} allowFractional={true} />
              {rating > 0 && <div className="rating-value">{rating.toFixed(1)}/5</div>}
        </div>

        {rating > 0 && <FeedbackCategory rating={rating} />}
      </div>

      <form onSubmit={handleSubmit} className="feedback-form" key={showFeedbackForm ? 'visible' : 'hidden'}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={getFeedbackPlaceholder()}
          className="feedback-textarea"
        />

        {renderAIAnalysisSection()}

        <button type="submit" className="feedback-button">
          Submit Feedback
        </button>
      </form>

      {message && (
        <p className={`feedback-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
      </>
      )}
    </div>
  );
};

export default Feedback;
