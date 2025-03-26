import React, { useState } from 'react';
import axios from 'axios';
import './Feedback.css';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      setMessage('Please enter feedback before submitting');
      return;
    }

    try {
      console.log('Submitting feedback:', feedback);
      const response = await axios.post('/api/feedback', {
        feedback: feedback.trim(),
        timestamp: new Date()
      }, {
        baseURL: 'http://localhost:5001',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Server response:', response);

      if (response.status === 201) {
        setMessage('Thank you for your feedback!');
        setFeedback('');
      }
    } catch (error) {
      console.error('Detailed error:', error.response || error);
      setMessage(error.response?.data?.message || 'Error submitting feedback. Please try again.');
    }
  };

  return (
    <div className="feedback-container">
      <h2>Rate Our Assistant</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Please share your feedback about our AI assistant..."
          className="feedback-textarea"
        />
        <button type="submit" className="feedback-button">
          Submit Feedback
        </button>
      </form>
      {message && <p className={`feedback-message ${message.includes('Error') ? 'error' : 'success'}`}>
        {message}
      </p>}
    </div>
  );
};

export default Feedback;
