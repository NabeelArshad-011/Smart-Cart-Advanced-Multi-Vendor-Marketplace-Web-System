import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";


const Ratings = ({ rating }) => {
  const stars = [];
 
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <AiFillStar
          key={i} 
          size={16}
          className="text-yellow-500" 
        />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <BsStarHalf
          key={i}
          size={14} 
          className="text-yellow-500"
        />
      );
    } else {
      stars.push(
        <AiOutlineStar
          key={i}
          size={16}
          className="text-yellow-500"
        />
      );
    }
  }
 
  return (
    <div className="flex items-center space-x-0.5">
      {stars}
      <span className="ml-1.5 text-sm text-gray-400">({rating})</span>
    </div>
  );
 };
 
 export default Ratings;