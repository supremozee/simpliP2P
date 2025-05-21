import React from 'react'
import { BsStarFill, BsStarHalf } from 'react-icons/bs';

const Rating = ({ rating = 0 }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsStarFill key={`full-${i}`} className="text-yellow-400 w-3 h-3" />);
    }
    
    if (hasHalfStar) stars.push(<BsStarHalf key="half" className="text-yellow-400 w-3 h-3" />);
    
    while (stars.length < 5) {
      stars.push(<BsStarFill key={`empty-${stars.length}`} className="text-gray-300 w-3 h-3" />);
    }
    
    return <div className="flex items-center">{stars}</div>;
  };
  
export default Rating