import React from "react";
import { cn } from "../lib/utils.ts";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  onChange,
  readOnly = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const getStarSymbol = (index: number) => {
    const isActive = index < (hoverRating || rating);
    return isActive ? "★" : "☆";
  };

  return (
    <div className="star-rating">
      {[...Array(maxRating)].map((_, index) => (
        <span
          key={index}
          className={cn(
            "star",
            readOnly ? "readonly" : "clickable"
          )}
          onClick={() => !readOnly && onChange?.(index + 1)}
          onMouseEnter={() => !readOnly && setHoverRating(index + 1)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
        >
          {getStarSymbol(index)}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
