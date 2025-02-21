import { cn } from '@/utils/cn';
import React from 'react';
import { FieldError } from 'react-hook-form';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  maxRating?: number;
  error?: FieldError;
  showLabel: boolean;
  isTable?:boolean
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, maxRating = 5, error, showLabel, isTable }) => {
  return (
    <div className="">
      {showLabel&&<label className="block text-sm font-medium text-gray-700">
        Rating
      </label>}
      <div className={cn("flex space-x-1",
        isTable ? "justify-center" : "justify-start"
      )}>
        {[...Array(maxRating)].map((_, index) => {
          const star = index + 1;
          return (
            <button
              key={star}
              className={`text-2xl leading-none ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              onClick={() => setRating(star)}
              type="button"
            >
              ★
            </button>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default StarRating;