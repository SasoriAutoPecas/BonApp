import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

export const StarRating = ({ rating, setRating, readOnly = false, size = 20 }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const handleClick = (index: number) => {
    if (!readOnly && setRating) {
      setRating(index);
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          size={size}
          className={cn(
            'transition-colors',
            (hoverRating || rating) >= index ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300',
            !readOnly && 'cursor-pointer'
          )}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};