import React from "react";


const FeedbackCategory = ({ rating, maxRating = 5 }) => {
  const getCategoryInfo = () => {
    const percentage = (rating / maxRating) * 100;

    if (percentage <= 20) {
      return {
        label: "Very Bad",
        description: "Significant improvement needed"
      };
    } else if (percentage <= 40) {
      return {
        label: "Bad",
        description: "Needs improvement"
      };
    } else if (percentage <= 60) {
      return {
        label: "Good",
        description: "Meets basic expectations"
      };
    } else if (percentage <= 80) {
      return {
        label: "Very Good",
        description: "Exceeds expectations"
      };
    } else {
      return {
        label: "Best",
        description: "Outstanding performance"
      };
    }
  };

  const category = getCategoryInfo();

  return (
    <div className="feedback-category">
      <p className="category-label">{category.label}</p>
      <p className="category-description">{category.description}</p>
    </div>
  );
};

export default FeedbackCategory;
