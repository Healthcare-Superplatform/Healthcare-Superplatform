import React from "react";
import { cn } from "../lib/utils.ts";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  allowFractional?: boolean;
}

const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  onChange,
  readOnly = false,
  allowFractional = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const getStarSymbol = (index: number) => {
    const currentRating = hoverRating || rating;
    const isFullStar = index < Math.floor(currentRating);
    const isHalfStar = allowFractional && index === Math.floor(currentRating) && currentRating % 1 >= 0.5;
    
    if (isFullStar) return "★";
    if (isHalfStar) return "⯨";
    return "☆";
  };

  const calculateRating = (clientX: number, element: HTMLElement, starIndex: number) => {
    const rect = element.getBoundingClientRect();
    const starWidth = rect.width;
    const clickPosition = clientX - rect.left;
    const decimal = clickPosition / starWidth;
    
    if (allowFractional) {
      // Round to nearest 0.5
      return Math.round((decimal + starIndex + 1) * 2) / 2;
    }
    return starIndex + 1;
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
          onClick={(e) => {
            if (readOnly) return;
            const rating = calculateRating(e.clientX, e.currentTarget, index);
            onChange?.(Math.min(maxRating, rating));
          }}
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
