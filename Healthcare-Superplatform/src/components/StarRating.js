import React from "react";
import { cn } from "../lib/utils.ts";

const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  onChange,
  readOnly = false,
  allowFractional = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const calculateRating = (clientX, target, index) => {
    if (!allowFractional) return index + 1;
    const { left, width } = target.getBoundingClientRect();
    const offsetX = clientX - left;
    const fraction = offsetX / width;
    return index + fraction;
  };

  const getStarSymbol = (index) => {
    const isActive = index < (hoverRating || rating);
    return isActive ? "★" : "☆";
  };

  return (
    <div className="star-rating">
      {[...Array(maxRating)].map((_, index) => (
        <span
          key={index}
          className={cn("star", readOnly ? "readonly" : "clickable")}
          onClick={(e) => {
            if (readOnly) return;
            const calculated = calculateRating(e.clientX, e.currentTarget, index);
            onChange?.(Math.min(maxRating, calculated));
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
